export const UNIT_EXPIRE = 'days';
// export const UNIT_EXPIRE = 'min';
export const UNIT_EXPIRE_REFRESH_TOKEN = 'days';
export const VALUE_TOKEN_EXPIRE = 1;
export const VALUE_REFRESH_TOKEN_EXPIRE = 35;
export const FORMAT_DATE = 'YYYY-MM-DD';
export const FORMAT_DATETIME = 'YYYY-MM-DD HH:mm:ss';
export const FORMAT_DATE_VN = 'DD/MM/YYYY';
export const FORMAT_TIME = 'HH:mm';
export const FORMAT_DATE_YYMMDD = 'YYMMDD';
export const FORMAT_DATEOFWEEK_FULL = 'dddd';
export const VALUE_TOKEN_EXPIRE_NOT_REMEMBER = 2;
export const UNIT_EXPIRE_NOT_REMEMBER = 'hours';
export const SIGN_UNIT_EXPIRE_NOT_REMEMBER = 'h';
export const VALUE_REFRESH_TOKEN_EXPIRE_NOT_REMEMBER = 0;
export const LOGO_UDON = '/uploads/Logo-Fazzdoc.png';
export const PHONE_NUMBER_REGEX = /^\d{8,15}$/;
export const DEFAULT_LANGUAGE = 'en';
export const RANGE_TRENDING_POINT = 60; // MIN
export const RELATIONSHIP_USER = [
    {
        key: 'Spouse',
        value: 'Spouse',
    },
    {
        key: 'Father',
        value: 'Father',
    },
    {
        key: 'Mother',
        value: 'Mother',
    },

    {
        key: 'Kids',
        value: 'Kids',
    },
    {
        key: 'Grandkids',
        value: 'Grandkids',
    },
    {
        key: 'Grandfather',
        value: 'Grandfather',
    },
    {
        key: 'Friend',
        value: 'Friend',
    },
    {
        key: 'Nephew',
        value: 'Nephew',
    },
];

export const PRIVILEGES = {
    VIEW_DASHBOARD: 'View Dashboard',
    CREATE_APPOINTMENT: 'Create Appointment',
    UPDATE_APPOINTMENT: 'Update Appointment',
    DELETE_APPOINTMENT: 'Delete Appointment',
    READ_APPOINTMENT: 'Read Appointment',
    CREATE_MEDICAL_FACILITIES: 'Create Medical Facilities',
    UPDATE_MEDICAL_FACILITIES: 'Update Medical Facilities',
    DELETE_MEDICAL_FACILITIES: 'Delete Medical Facilities',
    READ_MEDICAL_FACILITIES: 'Read Medical Facilities',
    CREATE_PATIENTS: 'Create Patients',
    UPDATE_PATIENTS: 'Update Patients',
    DELETE_PATIENTS: 'Delete Patients',
    READ_PATIENTS: 'Read Patients',
    CREATE_DOCTORS: 'Create Doctors',
    UPDATE_DOCTORS: 'Update Doctors',
    DELETE_DOCTORS: 'Delete Doctors',
    READ_DOCTORS: 'Read Doctors',
    CREATE_INSURANCE: 'Create Insurance',
    UPDATE_INSURANCE: 'Update Insurance',
    DELETE_INSURANCE: 'Delete Insurance',
    READ_INSURANCE: 'Read Insurance',
    CREATE_STATISTICS: 'Create Statistics',
    UPDATE_STATISTICS: 'Update Statistics',
    DELETE_STATISTICS: 'Delete Statistics',
    READ_STATISTICS: 'Read Statistics',
    CREATE_USERS: 'Create Users',
    UPDATE_USERS: 'Update Users',
    DELETE_USERS: 'Delete Users',
    READ_USERS: 'Read Users',
    CREATE_SETTING: 'Create Setting',
    UPDATE_SETTING: 'Update Setting',
    DELETE_SETTING: 'Delete Setting',
    READ_SETTING: 'Read Setting',
};

export const BOOKING_STATUS = {
    WAITING_FOR_CONFIRMATION: 1,
    BOOKING_MODIFIED: 2,
    CONFIRMED: 3,
    NOT_COMING: 4,
    CANCELLED: 5,
    COMPLETED: 6,
};

export const PARTITION_ROLES = {
    HOSPITAL: 1,
    FAZZDOC: 2,
};

export const ROLES = {
    SUPER_ADMIN: 1,
    BUYER: 2,
    SALERS: 3,
    PARTNER: 4,
};

export const ROLES_UNIQUE = {
    SUPER_ADMIN: 'super_admin',
    BUYER: 'buyer',
    SALERS: 'salers',
    PARTNER: 'partner',
};

export const LIST_ROLES = ['super_admin', 'buyer', 'salers', 'partner'];

export const COUNTRY_HAS_SIP = ['ID'];
export const TIMEZONE_DEFAULT = 420;

export const AVAILABLE_NEXT7DAYS = [1, 2, 3, 4, 5, 6];
export const AVAILABLE7DAYS = [0, 1, 2, 3, 4, 5, 6];

export const AVAILABLE3DAYS = [1, 2, 3];

export const AUTO_REJECT_REASON = 'Other';

export const DEFAULT_INDICES_DOCTOR = 'doctors';

export const EMAIL_HELLO_FAZZDOC = 'hello@fazzdoc.com';
export const SERVER_URI = 'http://localhost:3001';

// SPECICAL FUNCTION AND REWARD RANGER
export const REWARD_STEP = 5;
export const REWARD_MAX = 25;
export const SPECIAL_FUNCTION_PURCHASE_PRICE = 1000;

export const SPECIAL_FUNCTION_PURCHASE_PRICE_LIST = [
    {
        price: 1000,
        leaf: 1100,
    },
    {
        price: 3000,
        leaf: 3200,
    },
    {
        price: 6000,
        leaf: 6000,
    },
    {
        price: 12000,
        leaf: 11000,
    },
];

export const ONDA_INFO = {
    name: 'ONDA',
    address: '서울특별시 마포구 토정로 24-12 3층 ONDA',
    phone: '023364677',
    email: 'onda_sm@onda.co.kr',
};

export const getUserFromContextConnection = (context: any) => {
    return context?.connection?.context?.user;
};

export const ADMIN_ID_CHAT = '99999999';
