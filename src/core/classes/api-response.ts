export class ApiResponse<T> {
  constructor(
    public status: boolean,
    public message: string,
    public code: number,
    public data?: T,
  ) {}
}
