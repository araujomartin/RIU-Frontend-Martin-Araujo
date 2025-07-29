import { Hero } from '../domain/models/hero';

export const generateMockHero = (id: number): Hero => ({
    id,
    name: `Hero ${id}`,
    realName: `Real Hero ${id}`,
    powers: [`Power ${id}A`, `Power ${id}B`],
    origin: `Origin ${id}`,
    weakness: `Weakness ${id}`,
    team: `Team ${id}`,
    imageUrl: `https://example.com/hero${id}.jpg`
});
