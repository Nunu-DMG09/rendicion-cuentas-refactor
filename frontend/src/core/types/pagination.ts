export interface Pagination {
    total:        number;
    per_page:     number;
    current_page: number;
    total_pages:  number;
    has_next:     boolean;
    has_prev:     boolean;
    first_page:   number;
    last_page:    number;
}