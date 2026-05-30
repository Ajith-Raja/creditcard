import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import CardDetail from '../../components/CardDetail';
import { CreditCard } from '../../types';
import { api } from '../../services/api';

const CardDetailPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const [card, setCard] = useState<CreditCard | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            const fetchCard = async () => {
                try {
                    setLoading(true);
                    const data = await api.cards.getById(Number(id));
                    setCard(data);
                } catch (err: any) {
                    console.error('Failed to fetch card:', err);
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };
            fetchCard();
        }
    }, [id]);

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>Loading...</div>;
    }

    if (error || !card) {
        return <div style={{ textAlign: 'center', marginTop: '100px' }}>Card not found or error occurred.</div>;
    }

    return (
        <div>
            <CardDetail card={card} />
        </div>
    );
};

export default CardDetailPage;