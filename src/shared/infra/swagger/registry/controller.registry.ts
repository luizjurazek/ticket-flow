export class ControllerRegistry {
  private static controllers: object[] = [];

  static register(controller: object): void {
    this.controllers.push(controller);
  }

  static getAll(): object[] {
    return this.controllers;
  }
}
