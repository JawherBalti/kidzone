"use client";
// import * as z from "zod";
// import { useForm } from "react-hook-form";
// import { LoginSchema } from "@/schemas";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "../ui/form";
// import { Input } from "../ui/input";
// import { Button } from "../ui/button";
// import { FormError } from "../form-error";
// import { FormSuccess } from "../form-success";
// import { login } from "@/actions/login";
// import Link from "next/link";
// import { useState, useTransition } from "react";
// import { useSearchParams } from "next/navigation";
import { CardWrapper } from "./card-wrapper";

export const LoginForm = () => {
  // const [isPending, startTransition] = useTransition();
  // const [error, setError] = useState<string | undefined>("");
  // const [success, setSuccess] = useState<string | undefined>("");
  // const [showTwoFactor, setShowTwoFactor] = useState(false);

  // const searchParams = useSearchParams();
  // const callbackUrl = searchParams.get("callbackUrl")
  // const urlError =
  //   searchParams.get("error") === "OAuthAccountNotLinked"
  //     ? "This email is used to login with a different provider"
  //     : "";

  // const form = useForm<z.infer<typeof LoginSchema>>({
  //   resolver: zodResolver(LoginSchema),
  //   defaultValues: {
  //     email: "",
  //     password: "",
  //   },
  // });

  // const onSubmit = (values: z.infer<typeof LoginSchema>) => {
  //   setError("");
  //   setSuccess("");
  //   startTransition(() => {
  //     login(values, callbackUrl)
  //       .then((data) => {
  //         if (data?.error) {
  //           form.reset();
  //           setError(data?.error);
  //         }
  //         if (data?.success) {
  //           form.reset();
  //           setSuccess(data?.success);
  //         }
  //         if (data?.twoFactor) {
  //           setShowTwoFactor(true);
  //         }
  //       })
  //       .catch(() => setError("Something went wrong!"));
  //   });
  // };

  return (
    <CardWrapper
      headerLabel="Choose a provider to login"
      backButtonLabel="Back to home page"
      backButtonHref="/"
      showSocial
    >
      <></>
      {/* <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {showTwoFactor && (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Two factor code</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Enter your 2FA code"
                        type="text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {!showTwoFactor && (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="Enter your email"
                          type="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          {...field}
                          placeholder="Enter your password"
                          type="password"
                        />
                      </FormControl>
                      <Button
                        size="sm"
                        variant="link"
                        asChild
                        className="px-0 font-normal"
                      >
                        <Link href="/auth/reset">Forgot your password?</Link>
                      </Button>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
          <FormSuccess message={success} />
          <FormError message={error || urlError} />
          <Button disabled={isPending} type="submit" className="w-full">
            {showTwoFactor ? "Confirm" : "Login"}
          </Button>
        </form>
      </Form>*/}
    </CardWrapper> 
  );
};