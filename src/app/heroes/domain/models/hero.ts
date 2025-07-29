import { Prettify } from '../../../shared/models/prettify';
export interface Hero {
    id: number;
    name: string;
    realName: string;
    powers: string[];
    origin: string;
    weakness?: string;
    team?: string;
    imageUrl?: string;
}

export type CreateHero = Omit<Hero, 'id'>;
export type UpdateHero = Prettify<Partial<Omit<Hero, 'id'>> & { id: number }>;
