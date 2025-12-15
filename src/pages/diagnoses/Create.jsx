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
    const [patients, setPatients] = useState([]);

    const [diagnosisDateWindowOpen, setDiagnosisDateWindowOpen] = useState(false);

    const formSchema = z.object({
        patient_id: z.coerce.number().int().positive("Patient is required"),
        condition: z.string().min(1, "Condition is required"),
        diagnosis_date: z.date("Diagnosis date is required"),
    });
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            patient_id: undefined,
            condition: "",
            diagnosis_date: "",
        },
        mode: "onChange",
    });

    const createDiagnoses = async (data) => {

        const options = {
            method: "POST",
            url: `/diagnoses`,
            headers: {
                Authorization: `Bearer ${token}`
            },
            data,
        };

        try {
            let response = await axios.request(options);
            console.log(response.data);
            navigate('/diagnoses', { state: { 
                type: 'success',
                message: `Diagnoses created successfully` 
            }});
        } catch (err) {
            // console.log(err);
            console.log("BACKEND ERROR:", err.response?.data);
            console.log("ZOD ISSUES:", err.response?.data?.error?.issues);
        }

    };
    
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

    const handleSubmit = (data) => {
        console.log(data);

        let formattedData = {
            ...data,
            diagnosis_date: data.diagnosis_date.toISOString().split("T")[0],
        };
        console.log("Formatted Data");
        console.log(formattedData);
        createDiagnoses(formattedData);
    };

  return (
    <>
        <Card className="w-full max-w-md mt-4">
            <CardHeader>
                <CardTitle>Create a new Diagnoses</CardTitle>
            </CardHeader>
            <CardContent>
                <form id="create-diagnoses-form" onSubmit={form.handleSubmit(handleSubmit)}>
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
                            name="condition"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Condition</FieldLabel>
                                    <Input
                                        id="condition"
                                        {...field}
                                        placeholder="Condition"
                                        aria-invalid={fieldState.invalid}
                                    />

                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="diagnosis_date"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Diagnosis Date</FieldLabel>
                                    <Popover open={diagnosisDateWindowOpen} onOpenChange={setDiagnosisDateWindowOpen}>
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
                                                setDiagnosisDateWindowOpen(false);
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
                    form="create-diagnoses-form"
                    variant="outline" 
                    type="submit" 
                >Submit</Button>
            </CardFooter>
        </Card>
    </>
  );
}