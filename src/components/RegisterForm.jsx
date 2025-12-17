import { useState } from "react";
import axios from "@/config/api";
import { useAuth } from "@/hooks/useAuth";

import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";

export default function RegisterForm({onSwitch}) {
  // const [form, setForm] = useState({});
  const { onRegister } = useAuth();

  const formSchema = z.object({
    first_name: z.string().min(2, "First name must be at least 2 characters."),
    last_name: z.string().min(2, "Last name must be at least 2 characters."),
    email: z.email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(255, "Password must be at most 255 characters."),
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
    },
    mode: "onChange"
  });

  // const handleForm = (e) => {
  //   setForm({ ...form, [e.target.name]: e.target.value });
  // };

  const submitForm = async (data) => {
    console.log(data);
    let response = await onRegister(data.first_name, data.last_name, data.email, data.password);
    response && toast.error(response.msg)

    console.log(response);
  };


  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Register an account</CardTitle>
        <CardDescription>
          Enter your details below to register an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="register-form" onSubmit={form.handleSubmit(submitForm)}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">

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
                    <FieldLabel htmlFor="register-form-email">Email</FieldLabel>
                    <Input
                      id="register-form-email"
                      {...field}
                      placeholder="mo@example.com"
                      autoComplete="email"
                      aria-invalid={fieldState.invalid}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
            <div className="grid gap-2">
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="register-form-password">
                      Password
                    </FieldLabel>
                    <Input
                      id="register-form-password"
                      type="password"
                      {...field}
                      autoComplete="current-password"
                      aria-invalid={fieldState.invalid}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button form="register-form" variant='outline' type="submit" className="w-full cursor-pointer bg-primary text-white">
          Register
        </Button>
        <CardDescription type="button" onClick={onSwitch}>
          Already have an account? <span className="cursor-pointer text-gray-900 font-semibold underline">Login</span>
        </CardDescription>
      </CardFooter>
    </Card>
  );
}
