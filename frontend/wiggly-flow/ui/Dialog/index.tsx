import * as React from "react";
import { Dialog as Primitive } from "radix-ui";

export const Dialog = () => (
  <Primitive.Root>
    <Primitive.Trigger asChild>
      <button className="inline-flex h-[35px] items-center justify-center rounded bg-purple-100 px-[15px] font-medium leading-none text-purple-700 outline-none outline-offset-1 hover:bg-gray-200 focus-visible:outline-2 focus-visible:outline-purple-500 select-none">
        Edit profile
      </button>
    </Primitive.Trigger>
    <Primitive.Portal>
      <Primitive.Overlay className="fixed inset-0 bg-black/40 data-[state=open]:animate-fade-in" />
      <Primitive.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-[25px] shadow-lg focus:outline-none data-[state=open]:animate-zoom-in">
        <Primitive.Title className="m-0 text-[17px] font-medium text-gray-900">
          Edit profile
        </Primitive.Title>
        <Primitive.Description className="mb-5 mt-2.5 text-[15px] leading-normal text-gray-600">
          Make changes to your profile here. Click save when you're done.
        </Primitive.Description>
        <fieldset className="mb-[15px] flex items-center gap-5">
          <label
            className="w-[90px] text-right text-[15px] text-purple-700"
            htmlFor="name"
          >
            Name
          </label>
          <input
            className="inline-flex h-[35px] w-full flex-1 items-center justify-center rounded px-2.5 text-[15px] leading-none text-purple-700 shadow-[0_0_0_1px] shadow-purple-300 outline-none focus:shadow-[0_0_0_2px] focus:shadow-purple-500"
            id="name"
            defaultValue="Pedro Duarte"
          />
        </fieldset>
        <fieldset className="mb-[15px] flex items-center gap-5">
          <label
            className="w-[90px] text-right text-[15px] text-purple-700"
            htmlFor="username"
          >
            Username
          </label>
          <input
            className="inline-flex h-[35px] w-full flex-1 items-center justify-center rounded px-2.5 text-[15px] leading-none text-purple-700 shadow-[0_0_0_1px] shadow-purple-300 outline-none focus:shadow-[0_0_0_2px] focus:shadow-purple-500"
            id="username"
            defaultValue="@peduarte"
          />
        </fieldset>
        <div className="mt-[25px] flex justify-end">
          <Primitive.Close asChild>
            <button className="inline-flex h-[35px] items-center justify-center rounded bg-green-100 px-[15px] font-medium leading-none text-green-700 outline-none outline-offset-1 hover:bg-green-200 focus-visible:outline-2 focus-visible:outline-green-500 select-none">
              Save changes
            </button>
          </Primitive.Close>
        </div>
        <Primitive.Close asChild>
          <button
            className="absolute right-2.5 top-2.5 inline-flex size-[25px] appearance-none items-center justify-center rounded-full text-purple-700 bg-gray-100 hover:bg-purple-100 focus:shadow-[0_0_0_2px] focus:shadow-purple-500 focus:outline-none"
            aria-label="Close"
          >
            <i className="ri-close-line" />
          </button>
        </Primitive.Close>
      </Primitive.Content>
    </Primitive.Portal>
  </Primitive.Root>
);