import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Routine } from "./rutine.entity";
import { UpdateRoutineDto } from "./DTO/update-routine.dto";
import { RoutineTrainer } from "./routineTrainer";
import { Trainer } from "src/Trainer/trainer.entity";
import { GymUser } from "src/gym/gymUser.entity";

@Injectable()
export class RoutineService{
    constructor(@InjectRepository(Routine)readonly routineRepository:Repository<Routine>) {}
async getServiceRoutines() {
    const getAllRoutines = await this.routineRepository.find({
        withDeleted: false          //Evita que find() devuelva rutinas eliminadas con soft delete
    })
    return getAllRoutines
}
async getServiceRoutineByName(name: string) {
    const specificRoutine = await this.routineRepository.findOne({
        where: {name}
    })
    if (!specificRoutine) {
        const getAllRoutines = await this.getServiceRoutines()
        return {Advertencia:'Rutina no existente', getAllRoutines}
    }
    return specificRoutine
}
async deleteServiceRoutine(name: string) {
    const routinetoDelete = await this.routineRepository.findOne({
        where: {name}
    })
    if (!routinetoDelete) {
        return {Advertencia:'Rutina no existente'}
    }
    await this.routineRepository.softRemove(routinetoDelete)
    return {mensaje:'Ejercico eliminado exitosamente (soft delete)'}
}
async createServiceRoutine(name: string, description: string) {
    const findRoutine = await this.routineRepository.findOne({
        where: {name},
        withDeleted: false              //verifica que no revise los que estaban eliminados
    })
    if (findRoutine) {
        return {Advertencia: 'Rutina existente'}
    }
    const newRoutine = this.routineRepository.create({name:name, description:description})
    await this.routineRepository.save(newRoutine)
    return newRoutine
}
async updateServiceRoutine(id:number, updateDto: UpdateRoutineDto) {
    const verificate = await this.routineRepository.findOne({
        where: {id},
    })
    
    const nombre = verificate.name
    const descripcion = verificate.description
    const esta_activo = verificate.is_active
    
    const {description, is_active, name} = updateDto
    if (nombre==name && descripcion==description && esta_activo==is_active) {
        return 'No hay cambios en los datos'
    }
    
    const result = await this.routineRepository
        .createQueryBuilder()
        .update(Routine)
        .set(updateDto)
        .where('id = :id', { id })
        .execute()
    
    if (result.affected === 0) {
        return {Advertencia: 'No se encontró ninguna rutina con ese ID'}
        
    }
    return {mensaje: 'Rutina actualizada correctamente'}

}
async serviceRecoverRoutine(id:number) {
    const findRoutine = await this.routineRepository.findOne({
        where: {id},
        withDeleted: true
    })
    if (!findRoutine) {
        return 'La rutina no existe'
    }
    const recoverRoutine = await this.routineRepository.restore(id)
    return 'Rutina recuperada'
}
async serviceRoutinesTrainers(id:string) {
    const getRoutinesTrainer = await this.routineRepository
    .createQueryBuilder('r')
    .leftJoinAndSelect(RoutineTrainer, 'rt', 'r.id=rt.routineId')
    .leftJoinAndSelect(Trainer, 't', 't.identification=rt.trainerIdentification')
    .leftJoinAndSelect(GymUser, 'g', 'g.userIdentification=t.identification')
    .where('g.gymId= :id',{id})
    .getMany()

    return getRoutinesTrainer

    
}

}