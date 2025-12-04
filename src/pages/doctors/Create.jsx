import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import axios from "@/config/api";
import { data, useNavigate } from 'react-router';
import { useAuth } from "@/hooks/useAuth";

const doctorSchema = z.object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    specialisation: z.string().min(1, "Specialisation is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone number is required"),
});

export default function Create() {
    const navigate = useNavigate();
    const { token } = useAuth();

    const form = useForm({
        resolver: zodResolver(doctorSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            specialisation: "",
            email: "",
            phone: ""
        },
    });

    // const [form, setForm] = useState({
    //     first_name: "",
    //     last_name: "",
    //     specialisation: "",
    //     email: "",
    //     phone: ""
    // });

    const submitForm = async (data) => {
        const options = {
            method: "POST",
            url: `/doctors`,
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: data,
        };

        try {
            let response = await axios.request(options);
            console.log(response.data);
            navigate('/doctors', { state: { 
                type: 'success',
                message: `Doctor "${response.data.first_name} ${response.data.last_name}" created successfully` 
            }});
        } catch (err) {
            console.log(err);
        }
    };

    // const handleChange = (e) => {
    //     setForm({
    //         ...form,
    //         [e.target.name] : e.target.value
    //     });
    // };

    // const createDoctor = async () => {

    //     const options = {
    //         method: "POST",
    //         url: `/doctors`,
    //         headers: {
    //             Authorization: `Bearer ${token}`
    //         },
    //         data: form
    //     };

    //     try {
    //         let response = await axios.request(options);
    //         console.log(response.data);
    //         navigate('/doctors', { state: { 
    //             type: 'success',
    //             message: `Doctor "${response.data.first_name} ${response.data.last_name}" created successfully` 
    //         }});
    //     } catch (err) {
    //         console.log(err);
    //     }

    // };

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     console.log(form);
    //     createDoctor();
    // };

  return (
    <>
        <h1>Create a new Doctor</h1>
        <form onSubmit={form.handleSubmit(submitForm)} className="flex flex-col gap-2">

            {/* FIRST NAME */}
            <Input 
                type="text" 
                placeholder="First Name" 
                name="first_name" 
                value={form.first_name} 
                onChange={handleChange} 
            />
            <Input 
                className="mt-2"
                type="text" 
                placeholder="Last Name" 
                name="last_name" 
                value={form.last_name} 
                onChange={handleChange} 
            />
            <Input 
                className="mt-2"
                type="text" 
                placeholder="Email" 
                name="email" 
                value={form.email} 
                onChange={handleChange} 
            />
            <Input 
                className="mt-2"
                type="text" 
                placeholder="Phone" 
                name="phone" 
                value={form.phone} 
                onChange={handleChange} 
            />
            <select
                name="specialisation"
                value={form.specialisation}
                onChange={handleChange}
                className="mt-2 border rounded-md p-2 w-full"
            >
                <option value="" disabled hidden className="text-gray-400">Specialisation</option>
                <option value="Podiatrist">Podiatrist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatrician">Pediatrician</option>
                <option value="Psychiatrist">Psychiatrist</option>
                <option value="General Practitioner">General Practitioner</option>
            </select>
            <Button 
                className="mt-4 cursor-pointer" 
                variant="outline" 
                type="submit" 
            >Submit</Button>
        </form>
    </>
  );
}