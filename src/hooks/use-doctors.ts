"use client"

import { createDoctor, getAvailableDoctors, getDoctors, updateDoctor } from "@/lib/actions/doctors"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export function useGetDoctors(){
    const result = useQuery({
        queryKey:["getDoctors"],
        queryFn:getDoctors
    });

    return result;
}

export function useCreateDoctor(){
    const queryClient = useQueryClient();

    const result = useMutation({
        mutationFn: createDoctor,
        onSuccess: ()=>{
            console.log("Doctor Created")
            queryClient.invalidateQueries({queryKey:["getDoctors"]})
        },
        onError:(error)=>console.log("error while creating a doctor ", error)
    })

    return result;
}

export function useUpdateDoctor(){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateDoctor,
        onSuccess: ()=>{
            console.log("Doctor Updated")
            queryClient.invalidateQueries({queryKey:["getDoctors"]})
        },
        onError:(error)=>console.log("error while updating a doctor ", error)
    })


}

export function useAvailableDoctors(){
    const result = useQuery({
        queryKey:["getAvailableDoctors"],
        queryFn:getAvailableDoctors,
    });

    return result;
}


