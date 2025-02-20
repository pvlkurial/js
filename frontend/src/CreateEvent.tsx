import { useForm, SubmitHandler } from "react-hook-form";
import "./styles/CreateEvent.css";

interface Inputs {
  comp_name: string;
  comp_imageurl: string;
};

const CreateEvent = () => {
const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<Inputs>();


  const onSubmit: SubmitHandler<Inputs> = (data) => {
    fetch("http://localhost:5000/comps", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to submit");
        }
        alert("Your application is updated.");
      })
      .catch(() => alert("Submission has failed."));
  };

  return (
    <div className="create-event-container">
      <div className="create-event-box">
        <h2>Create Event</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="input-group">
            <input
              {...register("comp_name", { required: true })}
              placeholder="Competition Name"
              className="input-field"
            />
            {errors.comp_name && <p className="error-text">This field is required</p>}
          </div>

          <div className="input-group">
            <input
              {...register("comp_imageurl", { required: true })}
              placeholder="Competition URL"
              className="input-field"
            />
            {errors.comp_imageurl && <p className="error-text">This field is required</p>}
          </div>

          <button type="submit" className="submit-button">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
