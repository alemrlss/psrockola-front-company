// i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const storedLanguage = localStorage.getItem("language");

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        psrockola_owner: "Owner",
        psrockola_employee: "Employee",
        psrockola_wallet: "Wallet",
        psrockola_appbar_expire: "Expire",
        psrockola_appbar_role_company: "Company",
        psrockola_appbar_role_employee: "Employee",
        menu_dashboard: "Dashboard",
        menu_transactions: "Transactions",
        menu_screens: "Screens",
        menu_currentplays: "Current Plays",
        menu_membership: "Memberships",
        menu_rockobits: "Rockobits",
        menu_employees: "Employees",
        menu_create: "Create",
        menu_list: "List",
        menu_transfer: "Transfer",
        menu_memberships_get: "Get",
        menu_memberships_cancel: "Cancel",
        menu_buy: "Buy",
        menu_sale: "Sales",
        menu_qr: "QR",
        menu_help: "Help",
        language_snackbar_message: "Language changed successfully",
        language_snackbar_error: "Error changing language",
        view_memberships: "Memberships",
        view_memberships_card_get: "Get",
        view_memberships_card_month: "month",
        view_memberships_card_year: "year",
        view_memberships_card_employees: "for employees",
        view_memberships_card_employees_account_singular: "account",
        view_memberships_card_employees_account_plural: "accounts",
        view_memberships_card_skins_singular: "skin available",
        view_memberships_card_skins_plural: "skins available",
        view_memberships_card_screens_start: "1 Screen (Maximum",
        view_memberships_card_screens_end: "Screens)",
        monthly_memberships: "Monthly",
        yearly_memberships: "Yearly",
        view_employees_create_title: "Create Employee",
        view_employees_create_limit: "Employees Limit",
        view_employees_create_name: "Name",
        view_employees_create_lastname: "Last Name",
        view_employees_create_email: "Email",
        view_employees_create_password: "Password",
        view_employees_create_address: "Address",
        view_employees_create_phone: "Phone",
        view_employees_create_photo: "Photo",
        view_employees_create_button: "Create",
        view_employees_create_loading: "Creating employee..",
        view_employees_list_limit: "Limit",
        view_employees_list_employees: "Employees",
        view_employees_list_name: "Name",
        view_employees_list_lastname: "Last Name",
        view_employees_list_email: "Email",
        view_employees_list_phone: "Phone",
        view_employees_list_address: "Address",
        view_employees_list_wallet: "Wallet",
        view_employees_list_playlist: "Playlist permission",
        view_employees_list_actions: "Actions",
        view_employees_list_not_found: "No employees found",
        view_employees_list_edit: "Edit",
        view_employees_list_delete: "Delete",
        view_employees_list_claim: "Claim RB",
        view_employees_list_transactions: "Transactions",
        view_employees_list_edit_tab_edit: "Edit",
        view_employees_list_edit_tab_password: "Change Password",
        view_employees_list_edit_tab_photo: "Change Photo",
        view_employees_list_edit_tab_edit_name: "Name",
        view_employees_list_edit_tab_edit_lastname: "Last Name",
        view_employees_list_edit_tab_edit_email: "Email",
        view_employees_list_edit_tab_edit_address: "Address",
        view_employees_list_edit_tab_edit_phone: "Phone",
        view_employees_list_edit_tab_edit_button: "Save",
        view_employees_list_edit_tab_password_password: "Password",
        view_employees_list_edit_tab_password_confirm_password:
          "Confirm Password",
        view_employees_list_edit_tab_password_button: "Change",
        view_employees_list_edit_tab_photo_title: "Change Profile Photo",
        view_employees_list_edit_tab_photo_upload: "Upload photo",
        view_employees_list_edit_tab_photo_button: "Change",
        view_employees_list_delete_title: "Confirm deletion",
        view_employees_list_delete_message:
          "Are you sure you want to delete this employee?",
          view_employees_list_delete_button_cancel: "Cancel",
        view_employees_list_delete_button_delete: "Delete",
      },
    },
    es: {
      translation: {
        psrockola_owner: "Dueño",
        psrockola_employee: "Empleado",
        psrockola_wallet: "Billetera",
        psrockola_appbar_expire: "Expira",
        psrockola_appbar_role_company: "Empresa",
        psrockola_appbar_role_employee: "Empleado",
        menu_dashboard: "Panel",
        menu_transactions: "Transacciones",
        menu_screens: "Pantallas",
        menu_currentplays: "Reproducciones actuales",
        menu_membership: "Membresias",
        menu_rockobits: "Rockobits",
        menu_employees: "Empleados",
        menu_create: "Crear",
        menu_list: "Lista",
        menu_transfer: "Transferir",
        menu_memberships_get: "Obtener",
        menu_memberships_cancel: "Cancelar",
        menu_buy: "Comprar",
        menu_sale: "Ventas",
        menu_qr: "QR",
        menu_help: "Ayuda",
        language_snackbar_message: "Idioma cambiado con éxito",
        language_snackbar_error: "Error al cambiar el idioma",
        view_memberships: "Membresías",
        view_memberships_card_get: "Obtener",
        view_memberships_card_month: "mes",
        view_memberships_card_year: "año",
        view_memberships_card_employees: "para empleados",
        view_memberships_card_employees_account_singular: "cuenta",
        view_memberships_card_employees_account_plural: "cuentas",
        view_memberships_card_skins_singular: "skin disponible",
        view_memberships_card_skins_plural: "skins disponibles",
        view_memberships_card_screens_start: "1 Pantalla (Máximo",
        view_memberships_card_screens_end: "Pantallas)",
        monthly_memberships: "Mensual",
        yearly_memberships: "Anual",
        view_employees_create_title: "Crear Empleado",
        view_employees_create_limit: "Límite de Empleados",
        view_employees_create_name: "Nombre",
        view_employees_create_lastname: "Apellido",
        view_employees_create_email: "Correo Electrónico",
        view_employees_create_password: "Contraseña",
        view_employees_create_address: "Dirección",
        view_employees_create_phone: "Teléfono",
        view_employees_create_photo: "Foto",
        view_employees_create_button: "Crear",
        view_employees_create_loading: "Creando empleado..",
        view_employees_list_limit: "Límite",
        view_employees_list_employees: "Empleados",
        view_employees_list_name: "Nombre",
        view_employees_list_lastname: "Apellido",
        view_employees_list_email: "Correo Electrónico",
        view_employees_list_phone: "Teléfono",
        view_employees_list_address: "Dirección",
        view_employees_list_wallet: "Billetera",
        view_employees_list_playlist: "Permiso de lista de reproducción",
        view_employees_list_actions: "Acciones",
        view_employees_list_not_found: "No se encontraron empleados",
        view_employees_list_edit: "Editar",
        view_employees_list_delete: "Eliminar",
        view_employees_list_claim: "Reclamar RB",
        view_employees_list_transactions: "Transacciones",
        view_employees_list_edit_tab_edit: "Editar",
        view_employees_list_edit_tab_password: "Cambiar Contraseña",
        view_employees_list_edit_tab_photo: "Cambiar Foto",
        view_employees_list_edit_tab_edit_name: "Nombre",
        view_employees_list_edit_tab_edit_lastname: "Apellido",
        view_employees_list_edit_tab_edit_email: "Correo Electrónico",
        view_employees_list_edit_tab_edit_address: "Dirección",
        view_employees_list_edit_tab_edit_phone: "Teléfono",
        view_employees_list_edit_tab_edit_button: "Guardar",
        view_employees_list_edit_tab_password_password: "Contraseña",
        view_employees_list_edit_tab_password_confirm_password:
          "Confirmar Contraseña",
        view_employees_list_edit_tab_password_button: "Cambiar",
        view_employees_list_edit_tab_photo_title: "Cambiar foto de perfil",
        view_employees_list_edit_tab_photo_upload: "Subir foto",
        view_employees_list_edit_tab_photo_button: "Cambiar",
        view_employees_list_delete_title: "Confirmar eliminacion",
        view_employees_list_delete_message:
          "¿Estás seguro de que quieres eliminar este empleado?",
        view_employees_list_delete_button_cancel: "Cancelar",
        view_employees_list_delete_button_delete: "Eliminar",
      },
    },
    pt: {
      translation: {
        psrockola_owner: "Proprietário",
        psrockola_employee: "Funcionário",
        psrockola_wallet: "Carteira",
        psrockola_appbar_expire: "Expirar",
        psrockola_appbar_role_company: "Empresa",
        psrockola_appbar_role_employee: "Funcionário",
        menu_dashboard: "Painel",
        menu_transactions: "Transações",
        menu_screens: "Telas",
        menu_currentplays: "Reproduções atuais",
        menu_membership: "Membros",
        menu_rockobits: "Rockobits",
        menu_employees: "Funcionários",
        menu_create: "Criar",
        menu_list: "Lista",
        menu_transfer: "Transferir",
        menu_memberships_get: "Obter",
        menu_memberships_cancel: "Cancelar",
        menu_buy: "Comprar",
        menu_sale: "Vendas",
        menu_qr: "QR",
        menu_help: "Ajuda",
        language_snackbar_message: "Idioma alterado com sucesso",
        language_snackbar_error: "Erro ao alterar o idioma",
        view_memberships: "Membros",
        view_memberships_card_get: "Obter",
        view_memberships_card_month: "mês",
        view_memberships_card_year: "ano",
        view_memberships_card_employees: "para funcionários",
        view_memberships_card_employees_account_singular: "conta",
        view_memberships_card_employees_account_plural: "contas",
        view_memberships_card_skins_singular: "skin disponível",
        view_memberships_card_skins_plural: "skins disponíveis",
        view_memberships_card_screens_start: "1 Tela (Máximo",
        view_memberships_card_screens_end: "Telas)",
        monthly_memberships: "Mensal",
        yearly_memberships: "Anual",
        view_employees_create_title: "Criar Funcionário",
        view_employees_create_limit: "Limite de Funcionários",
        view_employees_create_name: "Nome",
        view_employees_create_lastname: "Sobrenome",
        view_employees_create_email: "Email",
        view_employees_create_password: "Senha",
        view_employees_create_address: "Endereço",
        view_employees_create_phone: "Telefone",
        view_employees_create_photo: "Foto",
        view_employees_create_button: "Criar",
        view_employees_create_loading: "Criando funcionário..",
        view_employees_list_limit: "Limite",
        view_employees_list_employees: "Funcionários",
        view_employees_list_name: "Nome",
        view_employees_list_lastname: "Sobrenome",
        view_employees_list_email: "Email",
        view_employees_list_phone: "Telefone",
        view_employees_list_address: "Endereço",
        view_employees_list_wallet: "Carteira",
        view_employees_list_playlist: "Permissão de lista de reprodução",
        view_employees_list_actions: "Ações",
        view_employees_list_not_found: "Nenhum funcionário encontrado",
        view_employees_list_edit: "Editar",
        view_employees_list_delete: "Excluir",
        view_employees_list_claim: "Reivindicar RB",
        view_employees_list_transactions: "Transações",
        view_employees_list_edit_tab_edit: "Editar",
        view_employees_list_edit_tab_password: "Alterar senha",
        view_employees_list_edit_tab_photo: "Alterar foto",
        view_employees_list_edit_tab_edit_name: "Nome",
        view_employees_list_edit_tab_edit_lastname: "Sobrenome",
        view_employees_list_edit_tab_edit_email: "Email",
        view_employees_list_edit_tab_edit_address: "Endereço",
        view_employees_list_edit_tab_edit_phone: "Telefone",
        view_employees_list_edit_tab_edit_button: "Salvar",
        view_employees_list_edit_tab_password_password: "Senha",
        view_employees_list_edit_tab_password_confirm_password:
          "Confirmar Senha",
        view_employees_list_edit_tab_password_button: "Alterar",
        view_employees_list_edit_tab_photo_title: "Alterar foto",
        view_employees_list_edit_tab_photo_upload: "Carregar foto",
        view_employees_list_edit_tab_photo_button: "Alterar",
        view_employees_list_delete_title: "Confirmar exclusão",
        view_employees_list_delete_message:
          "Tem certeza de que deseja excluir este funcionário?",
        view_employees_list_delete_button_cancel: "Cancelar",
        view_employees_list_delete_button_delete: "Excluir",
      },
    },
  },
  lng: storedLanguage || "en",
  fallbackLng: ["en", "es", "pt"],
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
