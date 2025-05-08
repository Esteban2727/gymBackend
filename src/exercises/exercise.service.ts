import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Exercise } from "./Entity/exercise.entity";
import { Repository } from "typeorm";

@Injectable()
export class ExerciseGroupService {
    constructor(@InjectRepository(Exercise)readonly exerciseRepository:Repository<Exercise>) {}
async getExerciseService() {
    const getExerciseRepository = await this.exerciseRepository.find()
    return getExerciseRepository

}
async createExerciseService(name: string, description: string, difficulty_level: string, equipment: string) {
    const verificate = await this.exerciseRepository.findOne({
        where: {name},
        withDeleted: false   //verifica que no revise los que estaban eliminados
    })
    console.log (verificate)
    if (verificate) {
        return 'ejercicio existente'
    }
    const exercise = this.exerciseRepository.create({name: name, description: description, difficulty_level: difficulty_level, equipment:difficulty_level})
    await this.exerciseRepository.save(exercise)
    return {mensaje:'Creado exitosamente'}
}
async deleteExerciseService(name: string) {
    const exerciseToDelete = await this.exerciseRepository.findOne({
        where: {name}
    })
    if (!exerciseToDelete) {
        return 'Ejercicio no existente'
    }
    await this.exerciseRepository.softRemove(exerciseToDelete)
    return {mensaje:'Ejercico eliminado exitosamente (soft delete)'}
}
async findByNameExersiceService(name: string) {   
    const findByNameExercise = await this.exerciseRepository.findOne({
        where: {name}
    })
    if (!findByNameExercise) {
        const findExercise = await this.getExerciseService()
        return {Advertencia :'No se encontró en la base de datos', Data: findExercise}

    }
    return findByNameExercise
}
}
