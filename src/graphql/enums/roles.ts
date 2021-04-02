import { registerEnumType } from '@nestjs/graphql';

export enum RoleEnum {
    SUPER_ADMIN = 'super_admin',
    ADMIN = 'admin',
    BUYER = 'buyer',
    SELLER = 'seller',
    POWER_SELLER = 'power_seller',
    PARTNER = 'partner',
}

registerEnumType(RoleEnum, {
    name: 'RoleEnum',
});
