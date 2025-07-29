import { PaginationRequest } from '../../../shared/models/pagination';
import { Prettify } from '../../../shared/models/prettify';

export type HeroFilter = Prettify<PaginationRequest & {
    name?: string;
}>;
