import { Injectable, Inject, ConflictException, BadRequestException } from '@nestjs/common';
import { RegisterDto } from '../dtos/register.dto';
import { SupabaseAuthService } from '../../infrastructure/services/supabase-auth.service';
import { UnauthorizedException } from '../../../../shared/infrastructure/exceptions/domain.exceptions';
import type { UserRepository } from '../../domain/repositories/user.repository';
import type { CompanyRepository } from '../../domain/repositories/company.repository';
import { USER_REPOSITORY_TOKEN } from '../../domain/repositories/user.repository.token';
import { User } from '../../domain/entities/user.entity';
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

    // 1. Intentar crear el usuario en Supabase Auth
    console.log(`📝 Intentando crear usuario en Supabase Auth...`);
    const authResult = await this.supabaseAuthService.signUp({
      email: registerDto.email,
      password: registerDto.password,
      name: `${registerDto.first_name} ${registerDto.last_name}`,
    });

    // 2. Manejar diferentes escenarios de Supabase
    console.log(`🔄 Resultado de Supabase:`, authResult.error ? `Error: ${authResult.error.message}` : 'Éxito');
    if (authResult.error) {
      const errorMessage = authResult.error.message.toLowerCase();
      
      // Si el usuario ya existe en Supabase, obtener su información
      if (errorMessage.includes('user already registered') || 
          errorMessage.includes('email address already in use') ||
          errorMessage.includes('email already registered')) {
        
        console.log(`🔐 Usuario ${registerDto.email} ya existe en Supabase, intentando login para obtener UUID...`);
        
        // Intentar hacer login para obtener el UUID del usuario existente
        const loginResult = await this.supabaseAuthService.signIn({
          email: registerDto.email,
          password: registerDto.password,
        });

        console.log(`🔐 Resultado del login:`, loginResult.error ? `Error: ${loginResult.error.message}` : `Éxito - UUID: ${loginResult.user?.id}`);

        if (loginResult.error || !loginResult.user) {
          throw new BadRequestException(
            'El usuario ya existe pero las credenciales no coinciden. Si olvidaste tu contraseña, usa la opción de recuperación.'
          );
        }

        supabaseUserId = loginResult.user.id;
        authUserData = loginResult.user;
        isNewUser = false;
        console.log(`✅ Usuario existente detectado - UUID: ${supabaseUserId}`);
      } else {
        // Otros errores de Supabase
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
    } else {
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

      // 3. Validar que se proporcione company_id O company
      if (!registerDto.company_id && !registerDto.company) {
        throw new BadRequestException('Debe proporcionar company_id o datos de la empresa (company)');
      }

      // 4. Buscar empresa por company_id si se proporciona
      if (registerDto.company_id) {
        const existingCompany = await this.companyRepository.findById(registerDto.company_id);
        if (!existingCompany) {
          throw new BadRequestException(`No se encontró la empresa con ID: ${registerDto.company_id}`);
        }
        targetCompany = existingCompany;
      } else {
        // 5. Buscar empresa por NIT en los datos de la nueva empresa
        if (!registerDto.company) {
          throw new BadRequestException('Debe proporcionar datos de la empresa cuando no se especifica company_id');
        }
        
        const existingCompanyByNit = await this.companyRepository.findByNit(registerDto.company.nit);
        
        if (existingCompanyByNit) {
          console.log(`Empresa con NIT ${registerDto.company.nit} ya existe, usando empresa existente`);
          targetCompany = existingCompanyByNit;
        } else {
          // 6. Crear nueva empresa si no existe por NIT
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

      // 7. SIEMPRE verificar si ya existe un registro de usuario con esta empresa específica
      // Esto aplica tanto para usuarios nuevos como existentes
      console.log(`🔍 Verificando si usuario ${supabaseUserId} ya está registrado en empresa ${targetCompany.id}...`);
      const existingUserInCompany = await this.userRepository.findBySupabaseUuidAndCompanyId(
        supabaseUserId, 
        targetCompany.id
      );
      
      console.log(`🔍 Resultado de búsqueda:`, existingUserInCompany ? `Usuario encontrado con ID: ${existingUserInCompany.id}` : 'No encontrado');
      
      if (existingUserInCompany) {
        console.log(`❌ CONFLICTO DETECTADO: Usuario ya registrado en empresa`);
        throw new ConflictException(
          `El usuario ya está registrado en la empresa "${targetCompany.name}" (NIT: ${targetCompany.nit}). No se puede crear un registro duplicado.`
        );
      }

      console.log(`✅ No hay conflicto, procediendo a crear registro...`);

      // 8. Crear el registro de usuario en la base de datos
      const user = User.create({
        supabaseUuid: supabaseUserId,
        email: registerDto.email,
        firstName: registerDto.first_name,
        lastName: registerDto.last_name,
        role: registerDto.role,
        companyId: targetCompany.id,
      });

      const savedUser = await this.userRepository.create(user);

      // 9. Obtener todas las empresas asociadas al usuario (para información adicional)
      const userCompanies = await this.userRepository.findCompaniesBySupabaseUuid(supabaseUserId);

      // 10. Determinar el mensaje de respuesta según el escenario
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
          id: savedUser.id,
          email: savedUser.email,
          firstName: savedUser.firstName,
          lastName: savedUser.lastName,
          fullName: savedUser.fullName,
          role: savedUser.role,
          companyId: savedUser.companyId,
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
