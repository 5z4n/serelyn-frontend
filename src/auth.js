import { supabase } from './supabase';

export const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password
    });

    return { data, error };
};

const user = data.user;
console.log(user.id);

await fetch(`${process.env.REACT_APP_API_URL}/analyze`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        user_id: user.id,
        text: message
    })
});

