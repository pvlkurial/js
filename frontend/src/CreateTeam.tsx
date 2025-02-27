import { useForm, SubmitHandler } from "react-hook-form";
import "./styles/CreateEvent.css";

interface Inputs {
  team_name: string;
  logo_url: string;
  description: string;
};

const CreateTeam = () => {
const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<Inputs>();


  const onSubmit: SubmitHandler<Inputs> = (data) => {
    fetch("http://localhost:5000/teams", {
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
      <title>Create Team | Match Dumper</title>
      <div className="create-event-box">
        <h2>Create Team</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="input-group">
            <input
              {...register("team_name", { required: true })}
              placeholder="Team Name"
              className="input-field"
            />
            {errors.team_name && <p className="error-text">This field is required</p>}
          </div>

          <div className="input-group">
            <input
              {...register("logo_url", { required: true })}
              placeholder="Team Logo URL"
              className="input-field"
            />
            {errors.logo_url && <p className="error-text">This field is required</p>}
          </div>

          <div className="input-group">
            <input
              {...register("description", { required: false })}
              placeholder="Description"
              className="input-field"
            />
            {errors.description && <p className="error-text">This field is required</p>}
          </div>

          <button type="submit" className="submit-button">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default CreateTeam;
