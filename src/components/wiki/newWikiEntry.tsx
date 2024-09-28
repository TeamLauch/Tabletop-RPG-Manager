import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { TextField, Button, Container, Typography } from '@mui/material';

export default function NewWikiEntry({ toggle, newArticle, setEditor }) {
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const res = await axios.post('/api/wiki/create', { title, content });
        if (res.status === 200) {
            toggle(false)
            newArticle(res.data)
            setEditor(true)
        };
    };

    const handleToggle = () => {
        toggle(false);
    }

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" component="h1" gutterBottom>
                Neuer Wiki-Eintrag
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Titel"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                />
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Erstellen
                </Button>
                <Button onClick={handleToggle} sx={{ mt: 1 }} type="button" variant="contained" color="primary" fullWidth>
                    Abbrechen
                </Button>
            </form>
        </Container>
    );
}
