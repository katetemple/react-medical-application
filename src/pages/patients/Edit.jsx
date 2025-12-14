import axios from "@/config/api";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router";

import { useState, useEffect } from "react";
import { useParams } from "react-router";
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
    const { token } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();
    const [dobWindowOpen, setDobWindowOpen] = useState(false);

    const formSchema = z.object({
        first_name: z.string().min(1, "First name is required"),
        last_name: z.string().min(1, "Last name is required"),
        email: z.string().email("Invalid email address"),
        phone: z.string().min(1, "Phone is required").max(11, "Phone number is too long"),
        date_of_birth: z.date("Date of Birth is required"),
        address: z.string().min(1, "Address is required"),
    });
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            email: "",
            phone: "",
            date_of_birth: "",
            address: "",
        },
        mode: "onChange",
    });

    useEffect(() => {
        const fetchPatient = async () => {
            const options = {
                method: "GET",
                url: `/patients/${id}`,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            try {
                let response = await axios.request(options);
                console.log(response.data);
                let patient = response.data;
                form.reset({
                    first_name: patient.first_name,
                    last_name: patient.last_name,
                    email: patient.email,
                    phone: patient.phone.replace(/\s+/g, ""),
                    date_of_birth: new Date(patient.date_of_birth * 1000),
                    address: patient.address
                });
            } catch (err) {
                console.log(err);
            }
        };

        fetchPatient();
    }, []);

    const updatePatient = async (data) => {
        const options = {
            method: "PATCH",
            url: `/patients/${id}`,
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data,
        };

        try {
            let response = await axios.request(options);
            console.log(response.data);
            navigate("/patients", {
                state: {
                    type: 'success',
                    message: 'Patient updated Successfully'
                }
            });
        } catch (err) {
            console.log(err);
            console.log("BACKEND ERROR:", err.response?.data);
        }
    };

    const handleSubmit = (data) => {
        console.log(data);
        let formattedData = {
            ...data,
            phone: data.phone.replace(/\s+/g, ""),
            date_of_birth: data.date_of_birth.toISOString().split("T")[0],
        };

        updatePatient(formattedData);
    };

    return (
        <>
            <Card className="w-full max-w-md mt-4">
            <CardHeader>
                <CardTitle>Update Patient</CardTitle>
            </CardHeader>
            <CardContent>
                <form id="edit-patient-form" onSubmit={form.handleSubmit(handleSubmit)}>
                    <div className="flex flex-col gap-6">
                        <Controller
                            name="first_name"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>First Name</FieldLabel>
                                    <Input
                                        id="first_name"
                                        {...field}
                                        placeholder="First Name"
                                        aria-invalid={fieldState.invalid}
                                    />

                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller 
                            name="last_name"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Last Name</FieldLabel>
                                    <Input
                                        id="last_name"
                                        {...field}
                                        placeholder="Last Name"
                                        aria-invalid={fieldState.invalid}
                                    />

                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller 
                            name="email"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Email</FieldLabel>
                                    <Input
                                        id="email"
                                        {...field}
                                        placeholder="Email"
                                        aria-invalid={fieldState.invalid}
                                    />

                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller 
                            name="phone"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Phone Number</FieldLabel>
                                    <Input
                                        id="phone"
                                        {...field}
                                        placeholder="Phone Number"
                                        aria-invalid={fieldState.invalid}
                                    />

                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="date_of_birth"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>
                                        Date of Birth
                                    </FieldLabel>
                                    <Popover open={dobWindowOpen} onOpenChange={setDobWindowOpen}>
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
                            name="address"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Address</FieldLabel>
                                    <Input
                                        id="address"
                                        {...field}
                                        placeholder="Address"
                                        aria-invalid={fieldState.invalid}
                                    />

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
                    form="edit-patient-form"
                    variant="outline" 
                    type="submit" 
                >Submit</Button>
            </CardFooter>
        </Card>
        </>
    );
}
