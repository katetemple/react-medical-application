import axios from "@/config/api";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from 'react-router';

import { useEffect, useState } from 'react';
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from '@/components/ui/button';
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


export default function Create() {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [diagnoses, setDiagnoses] = useState([]);

    const [startDateWindowOpen, setStartDateWindowOpen] = useState(false);
    const [endDateWindowOpen, setEndDateWindowOpen] = useState(false);

    const formSchema = z.object({
        patient_id: z.coerce.number().int().positive("Patient is required"),
        doctor_id: z.coerce.number().int().positive("Doctor is required"),
        diagnosis_id: z.coerce.number().int().positive("Diagnosis is required"),
        medication: z.string().min(1, "Medication is required"),
        dosage: z.string().min(1, "Dosage is required"),
        start_date: z.date("Start date is required"),
        end_date: z.date("End date is required"),
    });
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            patient_id: undefined,
            doctor_id: undefined,
            diagnosis_id: undefined,
            medication: "",
            dosage: "",
            start_date: "",
            end_date: "",
        },
        mode: "onChange",
    });
    const patientSelected = form.watch("patient_id");

    const createPrescription = async (data) => {

        const options = {
            method: "POST",
            url: `/prescriptions`,
            headers: {
                Authorization: `Bearer ${token}`
            },
            data,
        };

        try {
            let response = await axios.request(options);
            console.log(response.data);
            navigate('/prescriptions', { state: { 
                type: 'success',
                message: `Prescription created successfully` 
            }});
        } catch (err) {
            // console.log(err);
            console.log("BACKEND ERROR:", err.response?.data);
            console.log("ZOD ISSUES:", err.response?.data?.error?.issues);
        }

    };

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

    useEffect(() => {
        const fetchDiagnoses = async () => {
            const options = {
                method: "GET",
                url: "/diagnoses",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
    
            try {
                let response = await axios.request(options);
                console.log(response.data);
                let diagnosesArray = response.data;
                let filteredDiagnosesArray = diagnosesArray.filter(diagnosis => {
                    return Number(diagnosis.patient_id) === Number(patientSelected);
                });
                setDiagnoses(filteredDiagnosesArray);
            } catch (err) {
                console.log(err);
            } 
        };
    
        fetchDiagnoses();
    }, [patientSelected]);

    const handleSubmit = (data) => {
        console.log(data);

        let formattedData = {
            ...data,
            start_date: data.start_date.toISOString().split("T")[0],
            end_date: data.end_date.toISOString().split("T")[0],
        };
        console.log("Formatted Data");
        console.log(formattedData);
        createPrescription(formattedData);
    };

  return (
    <>
        <Card className="w-full max-w-md mt-4">
            <CardHeader>
                <CardTitle>Create a new Prescription</CardTitle>
            </CardHeader>
            <CardContent>
                <form id="create-prescription-form" onSubmit={form.handleSubmit(handleSubmit)}>
                    <div className="flex flex-col gap-6">

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

                        <Controller 
                            name="diagnosis_id"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Condition</FieldLabel>
                                    <Select
                                        name={field.name}
                                        onValueChange={field.onChange}
                                        value={field.value?.toString()}
                                    >
                                        <SelectTrigger aria-invalid={fieldState.invalid}>
                                            <SelectValue placeholder="Select a condition" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {diagnoses.map((diagnosis) => (
                                                <SelectItem 
                                                    key={diagnosis.id}
                                                    value={diagnosis.id.toString()}
                                                >
                                                    {diagnosis.condition}
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
                            name="medication"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Medication</FieldLabel>
                                    <Input
                                        id="medication"
                                        {...field}
                                        placeholder="Medication"
                                        aria-invalid={fieldState.invalid}
                                    />

                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller 
                            name="dosage"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Dosage</FieldLabel>
                                    <Input
                                        id="dosage"
                                        {...field}
                                        placeholder="Dosage"
                                        aria-invalid={fieldState.invalid}
                                    />

                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />


                        <Controller
                            name="start_date"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Start Date</FieldLabel>
                                    <Popover open={startDateWindowOpen} onOpenChange={setStartDateWindowOpen}>
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
                                                setStartDateWindowOpen(false);
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
                            name="end_date"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>End Date</FieldLabel>
                                    <Popover open={endDateWindowOpen} onOpenChange={setEndDateWindowOpen}>
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
                                                setEndDateWindowOpen(false);
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

                    </div>
                </form>
            </CardContent>
            <CardFooter>
                <Button 
                    className="w-full cursor-pointer" 
                    form="create-prescription-form"
                    variant="outline" 
                    type="submit" 
                >Submit</Button>
            </CardFooter>
        </Card>
    </>
  );
}