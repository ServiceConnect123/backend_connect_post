import { Injectable, Inject, ConflictException, BadRequestException } from '@nestjs/common';
import { RegisterDto } from '../dtos/register.dto';
import { SupabaseAuthService } from '../../infrastructure/services/supabase-auth.service';
import { UnauthorizedException } from '../../../../shared/infrastructure/exceptions/domain.exceptions';
import type { UserRepository } from '../../domain/repositories/user.repository';
import type { CompanyRepository } from '../../domain/repositories/company.repository';
import { USER_REPOSITORY_TOKEN } from '../../domain/repositories/user.repository.token';
import { User } from '../../domain/entities/user.entity';
import { UserCompany } from '../../domain/entities/user-company.entity';
import { Company } from '../../domain/entities/company.entity';
import { COMPANY_REPOSITORY_TOKEN } from '../../domain/repositories/company.repository.token';

@Injectable()
export class RegisterUseCase {
  constructor(
    private readonly supabaseAuthService: SupabaseAuthService,
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepository,
    @Inject(COMPANY_REPOSITORY_TOKEN)
    private readonly companyRepository: CompanyRepository,
  ) {}

  async execute(registerDto: RegisterDto) {
    console.log(`🔍 REGISTRO INICIADO para email: ${registerDto.email}`);
    let isNewUser = false;
    let supabaseUserId: string;
    let authUserData: any;

    // 1. PRIMERO intentar login para ver si el usuario ya existe
    console.log(`🔐 Verificando si usuario ${registerDto.email} ya existe mediante login...`);
    const loginResult = await this.supabaseAuthService.signIn({
      email: registerDto.email,
      password: registerDto.password,
    });

    if (!loginResult.error && loginResult.user) {
      // Usuario existe y las credenciales coinciden
      supabaseUserId = loginResult.user.id;
      authUserData = loginResult.user;
      isNewUser = false;
      console.log(`✅ Usuario existente detectado - UUID: ${supabaseUserId}`);
    } else {
      // Usuario no existe o credenciales incorrectas, intentar crear nuevo usuario
      console.log(`📝 Usuario no existe, intentando crear nuevo usuario en Supabase Auth...`);
      const authResult = await this.supabaseAuthService.signUp({
        email: registerDto.email,
        password: registerDto.password,
        name: `${registerDto.first_name} ${registerDto.last_name}`,
      });

      console.log(`🔄 Resultado de SignUp:`, authResult.error ? `Error: ${authResult.error.message}` : 'Éxito');

      if (authResult.error) {
        const errorMessage = authResult.error.message.toLowerCase();
        
        // Manejar errores específicos de validación
        if (errorMessage.includes('password') && errorMessage.includes('6 characters')) {
          throw new BadRequestException('La contraseña debe tener al menos 6 caracteres');
        }
        
        if (errorMessage.includes('email') && errorMessage.includes('invalid format')) {
          throw new BadRequestException('El formato del email no es válido');
        }
        
        if (errorMessage.includes('signup is disabled')) {
          throw new BadRequestException('El registro de usuarios está temporalmente deshabilitado');
        }

        throw new UnauthorizedException(`Error de registro: ${authResult.error.message}`);
      }

      // Usuario nuevo creado exitosamente en Supabase
      if (!authResult.user) {
        throw new UnauthorizedException('No se pudo crear el usuario en el servicio de autenticación');
      }
      
      supabaseUserId = authResult.user.id;
      authUserData = authResult.user;
      isNewUser = true;
      console.log(`✅ Usuario nuevo creado - UUID: ${supabaseUserId}`);
    }

    try {
      let targetCompany: Company;
      let isNewCompany = false;

      // 2. Validar que se proporcione company_id O company
      if (!registerDto.company_id && !registerDto.company) {
        throw new BadRequestException('Debe proporcionar company_id o datos de la empresa (company)');
      }

      // 3. Buscar empresa por company_id si se proporciona
      if (registerDto.company_id) {
        const existingCompany = await this.companyRepository.findById(registerDto.company_id);
        if (!existingCompany) {
          throw new BadRequestException(`No se encontró la empresa con ID: ${registerDto.company_id}`);
        }
        targetCompany = existingCompany;
      } else {
        // 4. Buscar empresa por NIT en los datos de la nueva empresa
        if (!registerDto.company) {
          throw new BadRequestException('Debe proporcionar datos de la empresa cuando no se especifica company_id');
        }
        
        const existingCompanyByNit = await this.companyRepository.findByNit(registerDto.company.nit);
        
        if (existingCompanyByNit) {
          console.log(`Empresa con NIT ${registerDto.company.nit} ya existe, usando empresa existente`);
          targetCompany = existingCompanyByNit;
        } else {
          // 5. Crear nueva empresa si no existe por NIT
          console.log(`Creando nueva empresa con NIT ${registerDto.company.nit}`);
          const newCompany = Company.create({
            name: registerDto.company.name,
            nit: registerDto.company.nit,
            email: registerDto.company.email,
            phone: registerDto.company.phone,
            address: registerDto.company.address,
            countryId: registerDto.company.countryId,
            cityId: registerDto.company.cityId,
          });

          targetCompany = await this.companyRepository.create(newCompany);
          isNewCompany = true;
        }
      }

      // 6. Verificar si el usuario ya existe en nuestra BD local
      let user = await this.userRepository.findBySupabaseUuid(supabaseUserId);
      
      if (!user && isNewUser) {
        // 7. Crear usuario en BD local si es nuevo
        console.log(`👤 Creando usuario NUEVO en base de datos local...`);
        user = User.create({
          supabaseUuid: supabaseUserId,
          email: registerDto.email,
          firstName: registerDto.first_name,
          lastName: registerDto.last_name,
          phone: registerDto.phone,
          documentType: registerDto.document_type,
          documentNumber: registerDto.document_number,
        });

        user = await this.userRepository.create(user);
        console.log(`✅ Usuario nuevo creado en BD local con ID: ${user.id}`);
      } else if (!user && !isNewUser) {
        // Usuario existe en Supabase pero no en BD local (caso edge)
        console.log(`👤 Usuario existe en Auth pero no en BD local, creando...`);
        user = User.create({
          supabaseUuid: supabaseUserId,
          email: registerDto.email,
          firstName: registerDto.first_name,
          lastName: registerDto.last_name,
          phone: registerDto.phone,
          documentType: registerDto.document_type,
          documentNumber: registerDto.document_number,
        });

        user = await this.userRepository.create(user);
        console.log(`✅ Usuario creado en BD local con ID: ${user.id}`);
      }

      // 8. Verificar si ya existe una asociación usuario-empresa
      console.log(`🔍 Verificando asociación usuario-empresa...`);
      const existingAssociation = await this.userRepository.findUserCompanyByUserAndCompany(
        user!.id, 
        targetCompany.id
      );
      
      if (existingAssociation) {
        console.log(`❌ CONFLICTO DETECTADO: Usuario ya registrado en empresa`);
        throw new ConflictException(
          `El usuario ya está registrado en la empresa "${targetCompany.name}" (NIT: ${targetCompany.nit}). No se puede crear un registro duplicado.`
        );
      }

      // 9. Crear la asociación usuario-empresa
      console.log(`🔗 Creando asociación usuario-empresa...`);
      const userCompany = UserCompany.create({
        userId: user!.id,
        companyId: targetCompany.id,
        role: registerDto.role,
      });

      const savedUserCompany = await this.userRepository.createUserCompany(userCompany);
      console.log(`✅ Asociación creada con ID: ${savedUserCompany.id}`);

      // 10. Obtener todas las empresas asociadas al usuario (para información adicional)
      const userCompanies = await this.userRepository.findUserCompaniesBySupabaseUuid(supabaseUserId);

      // 11. Determinar el mensaje de respuesta según el escenario
      let message: string;
      if (isNewUser && isNewCompany) {
        message = 'Usuario y empresa registrados exitosamente. Por favor revisa tu email para verificar tu cuenta.';
      } else if (isNewUser && !isNewCompany) {
        message = 'Usuario registrado exitosamente en empresa existente. Por favor revisa tu email para verificar tu cuenta.';
      } else if (!isNewUser && isNewCompany) {
        message = 'Usuario existente asociado exitosamente a nueva empresa.';
      } else {
        message = 'Usuario existente asociado exitosamente a empresa existente.';
      }

      return {
        message,
        user: {
          id: user!.id,
          email: user!.email,
          firstName: user!.firstName,
          lastName: user!.lastName,
          fullName: user!.fullName,
          phone: user!.phone,
          documentType: user!.documentType,
          documentNumber: user!.documentNumber,
          emailConfirmed: isNewUser ? false : (authUserData.email_confirmed_at ? true : false),
          isNewUser,
          isNewCompany,
        },
        company: {
          id: targetCompany.id,
          name: targetCompany.name,
          nit: targetCompany.nit,
          email: targetCompany.email,
          isNewCompany,
        },
        userCompany: {
          id: savedUserCompany.id,
          role: savedUserCompany.role,
          createdAt: savedUserCompany.createdAt,
        },
        associatedCompanies: userCompanies.length,
        summary: {
          scenario: isNewUser ? 
            (isNewCompany ? 'NEW_USER_NEW_COMPANY' : 'NEW_USER_EXISTING_COMPANY') :
            (isNewCompany ? 'EXISTING_USER_NEW_COMPANY' : 'EXISTING_USER_EXISTING_COMPANY'),
          totalCompanies: userCompanies.length
        }
      };
    } catch (error) {
      console.error('Error al procesar el registro:', error);
      
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }
      
      throw new UnauthorizedException('Error interno al procesar el registro');
    }
  }
}