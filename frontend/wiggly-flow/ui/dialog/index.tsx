import { ReactNode, FC } from "react";
import { Dialog as Primitive } from "radix-ui";

interface DialogProps {
  title?: ReactNode;
  descr?: ReactNode;
  children?: ReactNode;
  trigger: ReactNode;
  onOk?: () => void;
}

export const Dialog: FC<DialogProps> = ({
  trigger,
  title,
  descr,
  children,
  onOk,
}) => (
  <Primitive.Root>
    <Primitive.Trigger asChild>{trigger}</Primitive.Trigger>
    <Primitive.Portal>
      <Primitive.Overlay className="fixed inset-0 bg-black/40 data-[state=open]:animate-overlayShow" />
      <Primitive.Content className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-[500px] max-h-[85vh] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl focus:outline-none origin-center data-[state=open]:animate-contentShow">
        <Primitive.Title className="m-0 text-[17px] font-medium text-gray-900">
          {title}
        </Primitive.Title>
        <Primitive.Description className="mb-5 mt-2.5 text-[15px] leading-normal text-gray-600">
          {descr}
        </Primitive.Description>
        {children}
        <div className="mt-[25px] flex justify-end gap-2">
          <Primitive.Close asChild>
            <button
              onClick={onOk}
              className="cursor-pointer inline-flex h-[35px] items-center justify-center rounded bg-primary px-[15px] font-medium leading-none text-white outline-none outline-offset-1 hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-primary-light select-none"
            >
              确定
            </button>
          </Primitive.Close>
        </div>
        <Primitive.Close asChild>
          <button
            className="cursor-pointer absolute right-2.5 top-2.5 inline-flex size-[25px] appearance-none items-center justify-center rounded-full text-primary bg-gray-100 hover:bg-purple-100 "
            aria-label="Close"
          >
            <i className="ri-close-line" />
          </button>
        </Primitive.Close>
      </Primitive.Content>
    </Primitive.Portal>
  </Primitive.Root>
);
