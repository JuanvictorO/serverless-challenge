import { inject, injectable } from 'tsyringe';

import { AppError } from '@shared/errors/AppError';

import { Employee } from '../infra/typeorm/entities/Employee';
import { EmployeeRepositoryInterface } from '../repositories/EmployeeRepositoryInterface';
import { OfficeRepositoryInterface } from '@modules/repositories/OfficeRepositoryInterface';
import { getDate } from '@shared/utils/getDate';
import { IUpdateEmployeeDTO } from '@modules/dtos/IUpdateEmployeeDTO';

type Request = {
  id: string;
  name: string;
  birthday: Date;
  office_id: string;
};

@injectable()
export class UpdateEmployeeUseCase {
  constructor(
    @inject('EmployeeRepository')
    private employeeRepository: EmployeeRepositoryInterface,

    @inject('OfficeRepository')
    private officeRepository: OfficeRepositoryInterface,
  ) {}

  public async execute({ id, name, birthday, office_id }: IUpdateEmployeeDTO): Promise<Employee> {
    const employee = await this.employeeRepository.findOne(id);

    if (!employee) {
      throw new AppError('Employee not found');
    }

    const office = await this.officeRepository.findOne(office_id);

    if (!office) {
      throw new AppError('Office not found');
    }

    employee.name = name;
    employee.birthday = birthday;
    employee.office_id = office_id;

    await this.employeeRepository.save(employee);

    const age = getDate(employee.birthday);
    employee.age = age;

    return employee;
  }
}
