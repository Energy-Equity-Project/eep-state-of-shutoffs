import { z } from 'astro:content';
import { shutoffsSchema } from '../content.config';

export type ShutoffRecord = z.infer<typeof shutoffsSchema>;
export type Shutoffs = ShutoffRecord[];
