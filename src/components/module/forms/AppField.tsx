/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { AnyFieldApi } from '@tanstack/react-form';
import React from 'react';

// this is a error message checker and it returns an error message as string.
export const getErrorMessage = (error: any): string => {
  if (error == null) return "";
  if (typeof error === "string") return error;
  if (typeof error === "number" || typeof error === "boolean") return String(error);
  if (Array.isArray(error)) {
    return error.map(getErrorMessage).filter(Boolean).join(", ");
  }
  if (typeof error === "object") {
    if ("message" in error && typeof error.message === "string") return error.message;
    if ("errors" in error) return getErrorMessage(error.errors);
    return Object.values(error).map(getErrorMessage).filter(Boolean).join(", ");
  }
  return String(error);
}

interface AppFieldProps {
  field: AnyFieldApi;
  labelName: string;
  append?: React.ReactNode;
  prepend?: React.ReactNode;
  placeholder?: string;
  type?: "text" | "number" | "password" | "email";
  disabled?: boolean;
  className?: string;
}
const AppField = ({ labelName, field, append, prepend, placeholder, type, disabled, className }: AppFieldProps) => {
  const errors = field.state.meta.errors;
  const ErrorMessage = field.state.meta.isTouched && errors && errors.length > 0 ? getErrorMessage(errors) : null;
  const hasError = Boolean(ErrorMessage);
  
  return (
    <div>
      <Label htmlFor={field.name} className={cn(hasError && "text-destructive")}>{labelName}</Label>
      <div className='relative'>
        {
          prepend && (<div className='absolute inset-y-0.5 left-0 items-center pl-2 pointer-events-auto z-10' > { prepend}</div>)
        }
        <Input
        id={field.name}
        name={field.name}
          value={field.state.value}
          placeholder={placeholder}
          type={type}
          onBlur={field.handleBlur}
          onChange={(e) => (field.handleChange(e.target.value))}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${field.name}-error` : undefined}
          className={
            cn(
              prepend && "pl-10",
              append && "pr-10",
              hasError && "border-destructive focus-visible:ring-destructive/20"
            )
          }
        />
        {
          append && (<div className='absolute inset-y-0.5 right-0 items-center pr-2 pointer-events-auto z-10' >{append}</div>)
        }
      
        {/* here are showing error message  */}
        {
          hasError && (
            <p
              id={`${field.name}-error`}
              role='alert'
              className='text-sm text-destructive'
            >
              {ErrorMessage}
            </p>
          )
        }

      </div>
    </div>
  );
};

export default AppField;