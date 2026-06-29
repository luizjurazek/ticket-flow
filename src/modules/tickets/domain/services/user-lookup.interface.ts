export interface IUserLookup {
  findById(id: string): Promise<{ id: string } | null>;
}
