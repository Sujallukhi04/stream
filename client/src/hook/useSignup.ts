import { signup } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useSignup = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  return { signupMutation: mutate, isPending, error };
};

export default useSignup;
