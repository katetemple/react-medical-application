import axios from "@/config/api";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router";
import { useParams } from "react-router";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldLabel,
    FieldError,
} from "@/components/ui/field";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";


export default function Edit() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const { token } = useAuth();

    const [appointmentDateWindowOpen, setAppointmentDateWindowOpen] = useState(false);

    const formSchema = z.object({
        appointment_date: z.date("Appointment date is required"),
        patient_id: z.coerce.number().int().positive("Patient is required"),
        doctor_id: z.coerce.number().int().positive("Doctor is required"),
    });
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            appointment_date: "",
            patient_id: undefined,
            doctor_id: undefined,
        },
        mode: "onChange",
    });

    useEffect(() => {
        const fetchAppointment = async () => {
            const options = {
                method: "GET",
                url: `/appointments/${id}`,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            try {
                let response = await axios.request(options);
                console.log(response.data);
                let appointment = response.data;
                form.reset({
                    appointment_date: new Date(appointment.appointment_date * 1000),
                    patient_id: appointment.patient_id,
                    doctor_id: appointment.doctor_id,
                });
            } catch (err) {
                console.log(err);
            }
        };

        fetchAppointment();
    }, []);

    useEffect(() => {
        const fetchDoctors = async () => {
            const options = {
                method: "GET",
                url: "/doctors",
            };

            try {
                let response = await axios.request(options);
                console.log(response.data);
                setDoctors(response.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchDoctors();
    }, []);

    useEffect(() => {
        const fetchPatients = async () => {
            const options = {
                method: "GET",
                url: "/patients",
            };

            try {
                let response = await axios.request(options);
                console.log(response.data);
                setPatients(response.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchPatients();
    }, []);

    const updateAppointment = async (data) => {
        const options = {
            method: "PATCH",
            url: `/appointments/${id}`,
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data,
        };

        try {
            let response = await axios.request(options);
            console.log(response.data);
            navigate("/appointments", {
                state: {
                    type: 'success',
                    message: 'Appointment updated successfully'
                }
            });
        } catch (err) {
            console.log(err);
        }
    };

    const handleSubmit = (data) => {
        console.log(data);
        let formattedData = {
            ...data,
            appointment_date: data.appointment_date.toISOString().split("T")[0],
        };
        updateAppointment(formattedData);
    };

    return (
        <>
            <Card className="w-full max-w-md mt-4">
            <CardHeader>
                <CardTitle>Update Appointment</CardTitle>
            </CardHeader>
            <CardContent>
                <form id="edit-appointment-form" onSubmit={form.handleSubmit(handleSubmit)}>
                    <div className="flex flex-col gap-6">

                        <Controller
                            name="appointment_date"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Appointment Date</FieldLabel>
                                    <Popover open={appointmentDateWindowOpen} onOpenChange={setAppointmentDateWindowOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                id="date"
                                                className="w-48 justify-between font-normal"
                                            >
                                                {field.value
                                                    ? field.value.toLocaleDateString()
                                                    : "Select date"}
                                                <ChevronDownIcon />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="w-auto overflow-hidden p-0"
                                            align="start"
                                        >
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                captionLayout="dropdown"
                                                onSelect={(selectedDate) => {
                                                field.onChange(selectedDate);
                                                setDobWindowOpen(false);
                                                }}
                                            />
                                        </PopoverContent>
                                    </Popover>

                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller 
                            name="patient_id"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Patient</FieldLabel>
                                    <Select
                                        name={field.name}
                                        onValueChange={field.onChange}
                                        value={field.value?.toString()}
                                    >
                                        <SelectTrigger aria-invalid={fieldState.invalid}>
                                            <SelectValue placeholder="Select a patient" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {patients.map((patient) => (
                                                <SelectItem 
                                                    key={patient.id}
                                                    value={patient.id.toString()}
                                                >
                                                    {patient.first_name} {patient.last_name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller 
                            name="doctor_id"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Doctor</FieldLabel>
                                    <Select
                                        name={field.name}
                                        onValueChange={field.onChange}
                                        value={field.value?.toString()}
                                    >
                                        <SelectTrigger aria-invalid={fieldState.invalid}>
                                            <SelectValue placeholder="Select a doctor" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {doctors.map((doctor) => (
                                                <SelectItem 
                                                    key={doctor.id}
                                                    value={doctor.id.toString()}
                                                >
                                                    {doctor.first_name} {doctor.last_name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />    

                    </div>
                </form>
            </CardContent>
            <CardFooter>
                <Button 
                    className="w-full cursor-pointer" 
                    form="edit-appointment-form"
                    variant="outline" 
                    type="submit" 
                >Submit</Button>
            </CardFooter>
        </Card>
        </>
    );
}
