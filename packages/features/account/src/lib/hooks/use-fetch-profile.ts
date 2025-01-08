import {useQuery} from '@tanstack/react-query';
import {useSupabase} from '@kit/supabase';

export function useFetchAccount() {
    const supabase = useSupabase();
    const queryKey = ['user', 'account'];

    const queryFn = async () => {
        const {data, error} = await supabase.from('accounts').select('*').limit(1).single();

        if (error) {
            throw error;
        }

        return data;
    };

    return useQuery({
        queryKey,
        queryFn,
    });
}