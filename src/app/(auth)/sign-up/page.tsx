import generateMetadata from "@/lib/generate-metadata";
import RegisterForm from "./register-form";

export const metadata = generateMetadata({
  title: "Sign In",
});

export const dynamic = "force-dynamic";

export default async function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <RegisterForm />
      </div>
    </div>
  );
}
