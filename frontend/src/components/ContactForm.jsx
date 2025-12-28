import { useForm } from "react-hook-form";

export default function ContactForm() {
  const { register, handleSubmit, formState } = useForm();
  const onSubmit = (data) => {
    // Replace with your API endpoint
    console.log("lead:", data);
    alert("Thanks — we received your request (demo).");
  };

  return (
    <section id="contact" className="py-12 bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-2xl font-bold">Contact Us</h2>
        <p className="text-gray-300 mt-2">
          Fill this form and we will call you to arrange an assessment.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <input
            {...register("name", { required: true })}
            placeholder="Full name"
            className="p-3 rounded bg-slate-800"
          />
          <input
            {...register("phone", { required: true })}
            placeholder="Phone number"
            className="p-3 rounded bg-slate-800"
          />
          <input
            {...register("location")}
            placeholder="City / State"
            className="p-3 rounded bg-slate-800"
          />
          <select
            {...register("service")}
            defaultValue=""
            className="p-3 rounded bg-slate-800"
          >
            <option value="">Select service</option>
            <option value="personal">Personal Care</option>
            <option value="nursing">Nursing</option>
            <option value="dementia">Dementia Care</option>
          </select>
          <textarea
            {...register("notes")}
            placeholder="Notes"
            className="p-3 rounded bg-slate-800 sm:col-span-2"
          />
          <button
            type="submit"
            className="sm:col-span-2 px-6 py-3 bg-blue-600 rounded-md font-semibold"
          >
            Request Callback
          </button>
        </form>
      </div>
    </section>
  );
}
