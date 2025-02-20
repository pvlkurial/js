import { useForm, SubmitHandler } from "react-hook-form"
import { Form } from "react-hook-form"



interface Team {
  id: number;
  team_name: string;
}

type Inputs = {
  CompName: string;
  CompURL : string;
}

const CreateEvent = () => {
  const {
    register,
    formState: { errors },
    control
  } = useForm()

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <h2 className="text-3xl font-semibold mb-4">Create Event</h2>

      <div>
        <form action="http://localhost:5000/comps"// Send post request with the FormData
        // encType={'application/json'} you can also switch to json object
        onSuccess={() => {
          alert("Your application is updated.")
        }}
        onError={() => {
          alert("Submission has failed.")
        }}control={control}>

        {/* register your input into the hook by invoking the "register" function */}
        <input defaultValue="Comp Name" {...register("CompName")} />

        {/* include validation with required or other standard HTML validation rules */}
        <input {...register("CompURL", { required: true })} />
        {/* errors will return when field validation fails  */}
        {errors.CompURL && <span>This field is required</span>}

        <button>Submit</button>
        </form>
      </div>


      <p className="text-lg text-gray-700">Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis, ex.</p>
    </div>
  );
};

export default CreateEvent;
