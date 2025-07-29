export interface Pagination<T> {
    actualPage: number;
    totalPages: number;
    dataLength: number;
    data: T[];
}

export interface PaginationRequest {
    page: number;
    perPage: number;
}
