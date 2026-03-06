# Prompts para Escribir Contenido SEO que Suene Humano
## Para usar con Claude/ChatGPT al redactar artículos de aipromptrace.com

---

# POR QUÉ EL CONTENIDO IA SE DETECTA

Los detectores de IA buscan estos patrones:
1. **Estructura predecible**: Intro → 5 puntos → conclusión (siempre igual)
2. **Vocabulario uniforme**: Mismo nivel de formalidad todo el rato
3. **Sin opinión personal**: Neutral robótico, nunca dice "esto es una mierda" o "me encantó"
4. **Transiciones genéricas**: "Furthermore", "Moreover", "In addition", "It's worth noting"
5. **Párrafos del mismo tamaño**: Todos ~3-4 líneas, perfectamente equilibrados
6. **Sin errores menores**: Demasiado perfecto gramaticalmente
7. **Lista infinita de adjetivos**: "comprehensive", "robust", "seamless", "cutting-edge"
8. **Empieza con "In today's..."**: La frase más IA del universo

---

# SISTEMA DE PROMPTS (3 FASES)

## FASE 1: PROMPT DE CONTEXTO (Usar al inicio de cada sesión)

```
You are a tech blogger who actually USES AI models daily for real work.
You're not an academic, not a journalist — you're a hands-on practitioner
who tests things and shares honest opinions.

Your writing style:
- Conversational but knowledgeable (like explaining to a smart friend)
- You use "I" and share personal experience: "I ran this prompt through both models..."
- You have opinions and aren't afraid to say "this model sucks at X"
- You vary sentence length A LOT: some very short. Others much longer with multiple clauses.
- You occasionally start sentences with "And", "But", "Look," or "Honestly,"
- You use contractions naturally (don't, can't, it's, wouldn't)
- You sometimes interrupt yourself with dashes — like this — to add asides
- You NEVER use: "In today's", "Furthermore", "Moreover", "It's worth noting",
  "landscape", "comprehensive", "robust", "seamless", "leveraging",
  "cutting-edge", "game-changer", "dive into", "delve into"
- Your paragraphs vary wildly in length. Some are one sentence. Others are 5-6 lines.
- You include real specifics: model names, parameter counts, actual prompt examples
- You occasionally express frustration or surprise genuinely

Your tone is like a tech review on a personal blog, NOT like a corporate whitepaper.
```

## FASE 2: PROMPT DE ESCRITURA (Para cada artículo)

```
Write a blog post about [TEMA]. Here are the requirements:

TARGET KEYWORD: [keyword]
WORD COUNT: 1,500-2,000 words
FORMAT: [comparativa / review / guía / lista]

STRUCTURE (vary this — don't follow it rigidly):
- Hook that creates curiosity (NOT "In today's world of AI...")
- Brief context (2-3 sentences max, then get to the point)
- Main content with H2/H3 headings
- Real test results from AI Prompt Race comparator (I'll provide data)
- Personal verdict / recommendation
- Natural CTA to try the comparator

CRITICAL RULES:
1. Start with a hook that could be any of these:
   - A surprising result you found
   - A question the reader probably has
   - A bold claim you'll back up
   - A short anecdote (1-2 sentences)

2. NEVER start any paragraph with these transitions:
   - "Furthermore" / "Moreover" / "Additionally" / "In addition"
   - "It's important to note" / "It's worth mentioning"
   - "When it comes to" / "In terms of"
   Replace them with: nothing (just start the sentence), "But", "And",
   "Thing is,", "Here's the deal:", "What surprised me:", or just a new thought.

3. Mix sentence lengths aggressively:
   BAD: "The model performs well. It handles coding tasks. It also does math."
   GOOD: "This thing rips through coding tasks. Math? Not so much — I threw a
   calculus problem at it and got back something that would make my high school
   teacher cry. But for everyday code generation, it's genuinely impressive."

4. Include at least 3 "I tested this" moments:
   - "I ran [specific prompt] through both models..."
   - "When I asked it to [task], here's what happened..."
   - "After testing [X] prompts, my takeaway is..."

5. Add imperfections naturally:
   - One sentence fragment. Like this.
   - An aside in parentheses (which you'd normally cut in formal writing)
   - A rhetorical question that doesn't get answered immediately

6. End sections with variety:
   - Sometimes a verdict: "Winner: Llama, by a mile."
   - Sometimes a caveat: "...but that changes if you need multilingual support."
   - Sometimes a transition to next section via curiosity
   - Sometimes just END the section. No wrap-up needed.

7. The conclusion should NOT summarize everything again. Instead:
   - Give your #1 recommendation
   - Mention a specific use case
   - Link to the comparator naturally
   - Optional: mention what you'll test next

8. Internal links (minimum 3):
   - Link to the comparator homepage naturally
   - Link to 2+ related blog posts
   - Use descriptive anchor text, never "click here"
```

## FASE 3: PROMPT DE REVISIÓN (Después de generar el borrador)

```
Review this draft and fix these AI-writing patterns:

1. Find any paragraph where ALL sentences are roughly the same length.
   Fix: make one much shorter or much longer.

2. Find any transition words from this list and remove/replace them:
   "Furthermore, Moreover, Additionally, In addition, It's worth noting,
   It's important to, When it comes to, In terms of, In today's,
   comprehensive, robust, seamless, cutting-edge, game-changer,
   dive into, delve into, landscape, leverage, harness"

3. Find any section that reads like a neutral encyclopedia entry.
   Fix: add a personal opinion, a "but", or a surprising take.

4. Check the opening paragraph — does it hook immediately or does it
   "set the stage" with generic context? Cut the setup, start with the hook.

5. Check if every H2 section follows the same internal structure.
   Fix: vary them. One section might be 2 paragraphs. Another might have
   a quick list. Another might be mostly a single long paragraph with examples.

6. Count exclamation marks. If more than 2 in the whole article, cut to max 1.

7. Look for "hedging" language (may, might, could potentially, it depends).
   Replace some with direct statements: "This is better" not "This might be better".

Return the improved version with changes highlighted.
```

---

# PALABRAS/FRASES PROHIBIDAS (BLACKLIST)

## Nunca usar:
| Prohibido | Alternativa |
|-----------|-------------|
| In today's world/landscape | [Eliminar, ir directo al punto] |
| Furthermore / Moreover | [Nada, o "And", "But", "Plus"] |
| It's worth noting that | [Eliminar, decirlo directamente] |
| Comprehensive | thorough, detailed, full |
| Robust | solid, strong, reliable |
| Seamless | smooth, clean, easy |
| Cutting-edge | latest, newest, modern |
| Game-changer | [ser específico sobre qué cambia] |
| Dive into / Delve into | look at, check out, break down |
| Leverage / Harness | use, take advantage of |
| In conclusion | [no usar — pasar directo al cierre] |
| As we can see | [eliminar] |
| It should be noted | [eliminar, decirlo y ya] |
| Moving forward | [eliminar] |
| At the end of the day | [eliminar o "Bottom line:"] |
| Empower / Elevate | help, improve, boost |
| Landscape | space, field, market |
| Paradigm | [no usar nunca] |
| Synergy | [no usar nunca] |
| Holistic | [no usar nunca] |

---

# EJEMPLOS DE INTRO

## MAL (suena a IA):
> "In today's rapidly evolving AI landscape, choosing the right language model
> can be a daunting task. With numerous options available, from Google's Gemma
> to Meta's Llama, it's important to understand the strengths and weaknesses
> of each model. In this comprehensive guide, we'll dive into a detailed
> comparison to help you make an informed decision."

## BIEN (suena humano):
> "I threw the same prompt at Gemma 3 and Llama 3.3 expecting similar results.
> I was wrong. One model nailed it in 2.1 seconds with a response I could've
> shipped to a client. The other... let's just say I had to read it twice to
> figure out what it was trying to say. Here's the full breakdown."

## TAMBIÉN BIEN:
> "Everyone keeps recommending Llama. 'It's 70B parameters!' 'It's Meta-backed!'
> Cool. But have you actually tried running it against Gemma 3 on a real task?
> Because the results might surprise you — they surprised me."

## OTRO EJEMPLO BUENO:
> "Quick question: if you had to pick ONE free AI model for writing blog posts,
> which would it be? I spent last week testing all 10 free models on OpenRouter
> with the exact same prompts. The winner wasn't who I expected."

---

# CHECKLIST PRE-PUBLICACIÓN

Antes de publicar cada artículo, verificar:

- [ ] ¿El primer párrafo engancha en 2 líneas? (no "In today's...")
- [ ] ¿Hay al menos 3 momentos "yo probé esto"?
- [ ] ¿Las frases varían en longitud? (mezcla de 5 y 25 palabras)
- [ ] ¿Los párrafos varían en tamaño? (1 línea algunos, 5 líneas otros)
- [ ] ¿Cero palabras de la blacklist?
- [ ] ¿Hay al menos 1 opinión fuerte/directa?
- [ ] ¿Internal links a comparador + 2 artículos?
- [ ] ¿Meta description < 155 chars con keyword?
- [ ] ¿El título tiene la keyword y es < 60 chars?
- [ ] ¿No empieza ninguna sección con "Furthermore/Moreover"?
- [ ] ¿La conclusión NO repite los puntos anteriores?
- [ ] ¿Incluye datos específicos (tiempos, word counts, model names)?

---

# FLUJO COMPLETO PARA CADA ARTÍCULO

```
1. Elegir keyword de KEYWORD_RESEARCH.md
2. Investigar: buscar qué hay en Google para esa keyword (top 5 resultados)
3. Generar tests reales con el comparador (obtener datos/capturas)
4. Usar FASE 1 prompt (contexto) → FASE 2 prompt (escritura)
5. Revisar con FASE 3 prompt (corrección anti-IA)
6. Revisión manual final (checklist)
7. Crear archivo .md en src/content/blog/
8. Verificar internal links
9. Build + deploy
10. Enviar URL a Google Search Console para indexar
```

---

*Última actualización: 2026-03-05*
