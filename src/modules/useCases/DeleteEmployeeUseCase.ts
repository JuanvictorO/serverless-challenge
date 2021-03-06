import { inject, injectable } from 'tsyringe';

import { AppError } from '@shared/errors/AppError';

import { EmployeeRepositoryInterface } from '../repositories/EmployeeRepositoryInterface';

@injectable()
export class DeleteEmployeeUseCase {
  constructor(
    @inject('EmployeeRepository')
    private employeeRepository: EmployeeRepositoryInterface,
  ) {}

  public async execute(id: string): Promise<void> {
    const employee = await this.employeeRepository.findOne(id);

    if (!employee) {
      throw new AppError('Employee not found');
    }

    await this.employeeRepository.delete(id);
  }
}
