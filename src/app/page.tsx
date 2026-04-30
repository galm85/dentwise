import { Show, SignOutButton, SignUpButton} from "@clerk/nextjs";

export default function Home() {
  return (
  <div>
    <h1>Home Page</h1>


    <Show when="signed-out">
      <SignUpButton mode="modal">Sign Up</SignUpButton>
    </Show>

    <Show when="signed-in">
      <SignOutButton>Signout</SignOutButton>
    </Show>
  </div>
  );
}
