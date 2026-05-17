"use server"

import { Gender } from "@prisma/client";
import { prisma } from "../prisma"
import { generateAvatar } from "../utils";
import { revalidatePath } from "next/cache";

// get all doctors
export async function getDoctors(){
    try {
        const doctors = await prisma.doctor.findMany({
            include:{
                _count:{select:{appointments:true}},
            },
            orderBy:{createdAt:"desc"}
        });

        return doctors.map((doctor) => ({
            ...doctor,
            appointmentCount: doctor._count.appointments
        }))

    } catch (error) {
        console.log("Error fetching doctors: " ,error);
        throw new Error("Failed to fetch doctors");
    }
}

// Create new Doctor
interface CreateDoctorInput {
    name:string;
    email:string;
    phone:string;
    speciality:string;
    gender:Gender;
    isActive:boolean;
}
export async function createDoctor(input:CreateDoctorInput){

    try {
        if(!input.name || !input.email) throw new Error("Name and email are required");

        const doctor = await prisma.doctor.create({
            data:{
                ...input,
                imageUrl:generateAvatar(input.name,input.gender)
            
            }
        })
        revalidatePath('/admin');
        return doctor;

    } catch (error:any) {
        console.error("Error creating doctor: ", error);
        if(error?.code === 'P2002') throw new Error("A doctor withi this email already exist");
        throw new Error ('Failed to create doctor');
    }
}

// Update a Doctor
interface UpdateDoctorInput extends Partial<CreateDoctorInput>{
    id:string;
}
export async function updateDoctor(input:UpdateDoctorInput) {
 
    try {
        
        //validate
        if(!input.name || !input.email) throw new Error("Name and Email are required");

        //get the doctor
        const currectDoctor = await prisma.doctor.findUnique({where:{email:input.email}});
        if(!currectDoctor) throw new Error("Doctor not found");

        // handle email changing - check if email already exist
        if(input.email !== currectDoctor.email){
            const exsitingDoctor = await prisma.doctor.findUnique({where:{email:input.email}});
            if(exsitingDoctor) throw new Error("A doctor with this email already exsist");
        }

        // update the doctor
        const doctor = await prisma.doctor.update({
            where: {id:input.id},
            data:{
                name:input.name,
                email:input.email,
                phone:input.phone,
                speciality:input.speciality,
                gender:input.gender,
                isActive:input.isActive
            }
        })

        return doctor

    } catch (error) {
        console.error("Error updateing doctor: ",error);
        throw new Error("Fail to update doctor");
    }
}


export async function getAvailableDoctors(){

    try {
        const doctors = await prisma.doctor.findMany({
            where:{isActive:true},
            include:{
                _count:{
                    select:{appointments:true}
                }
            },
            orderBy:{name:'asc'}
        });

        return doctors.map((doctor)=>({
            ...doctor,
            appointmentCount: doctor._count.appointments
        }));

    } catch (error) {
        console.error("Error Fetching available doctors: ",error);
        throw new Error("Fail to fatch available doctors");
    }
}