import type { ReactNode, Ref } from "react";

/* Public-domain texts, typed from the app's own screenshots. */

export const GUTENBERG = `The Project Gutenberg EBook of Pride and Prejudice, by Jane Austen

This eBook is for the use of anyone anywhere at no cost and with
almost no restrictions whatsoever.  You may copy it, give it away or
re-use it under the terms of the Project Gutenberg License included
with this eBook or online at www.gutenberg.org


Title: Pride and Prejudice

Author: Jane Austen

Release Date: August 26, 2008 [EBook #1342]
[Last updated: August 11, 2011]

Language: English

Character set encoding: ASCII

*** START OF THIS PROJECT GUTENBERG EBOOK PRIDE AND PREJUDICE ***




Produced by Anonymous Volunteers, and David Widger`;

/** Chapter 1, with the words a B1 reader would see shaded. */
export const CH1 = [
  `It is a truth [[universally]] [[!acknowledged]], that a [[single]] man in [[possession]] of a [[good]] fortune, must be in [[want]] of a wife.`,
  `However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the [[surrounding]] families, that he is considered the [[rightful]] property of some one or other of their daughters.`,
  `"My dear Mr. Bennet," said his lady to him one day, "have you heard that Netherfield Park is let at last?"`,
  `Mr. Bennet replied that he had not.`,
  `"But it is," returned she; "for Mrs. Long has just been here, and she told me all about it."`,
  `Mr. Bennet made no answer.`,
];

export const P12 = [
  `"Yes; but he seemed to like his second better."`,
  `"Oh! you mean Jane, I suppose, because he danced with her twice. To be sure that _did_ seem as if he admired her—indeed I rather believe he _did_—I heard something about it—but I hardly know what—something about Mr. Robinson."`,
  `"Perhaps you mean what I overheard between him and Mr. Robinson; did not I mention it to you? Mr. Robinson's asking him how he liked our Meryton assemblies, and whether he did not think there were a great many pretty women in the room, and _which_ he thought the prettiest? and his answering immediately to the last question: 'Oh! the eldest Miss Bennet, beyond a doubt; there cannot be two opinions on that point.'"`,
  `"Upon my word! Well, that is very decided indeed—that does seem as if—but, however, it may all come to nothing, you know."`,
  `"_My_ overhearings were more to the purpose than _yours_, Eliza," said Charlotte. "Mr. Darcy is not so well worth listening to as his friend, is he?—poor Eliza!—to be only just _tolerable_."`,
  `"I beg you would not put it into Lizzy's head to be vexed by his ill-treatment, for he is such a disagreeable man, that it would be quite a misfortune to be liked by him. Mrs. Long told me last night that he sat close to her for half-an-hour without once opening his lips."`,
  `"Are you quite sure, ma'am?—is not there a little mistake?" said Jane. "I certainly saw Mr. Darcy speaking to her."`,
  `"Aye—because she asked him at last how he liked Netherfield, and he could not help answering her; but she said he seemed quite angry at being spoke to."`,
  `"Miss Bingley told me," said Jane, "that he never speaks much, unless among his intimate acquaintances. With _them_ he is remarkably agreeable."`,
  `"I do not believe a word of it, my dear. If he had been so very agreeable, he would have talked to Mrs. Long. But I can guess how it was; everybody says that he is eat up with pride, and I dare say he had heard somehow that Mrs. Long does not keep a carriage, and had come to the ball in a hack chaise."`,
  `"I do not mind his not talking to Mrs. Long," said Miss Lucas, "but I wish he had danced with Eliza."`,
  `"Another time, Lizzy," said her mother, "I would not dance with _him_, if I were you."`,
  `"I believe, ma'am, I may safely promise you _never_ to dance with him."`,
  `"His pride," said Miss Lucas, "does not offend _me_ so much as pride often does, because there is an excuse for it. One cannot wonder that so very fine a young man, with family, fortune, everything in his favour, should think highly of himself. If I may so express it, he has a _right_ to be proud."`,
  `"That is very true," replied Elizabeth, "and I could easily forgive _his_ pride, if he had not mortified _mine_."`,
];

export const P13A = [
  `"Pride," observed Mary, who piqued herself upon the solidity of her reflections, "is a very common failing, I believe. By all that I have ever read, I am convinced that it is very common indeed; that human nature is particularly prone to it, and that there are very few of us who do not cherish a feeling of self-complacency on the score of some quality or other, real or imaginary. Vanity and pride are different things, though the words are often used synonymously. A person may be proud without being vain. Pride relates more to our opinion of ourselves, vanity to what we would have others think of us."`,
  `"If I were as rich as Mr. Darcy," cried a young Lucas, who came with his sisters, "I should not care how proud I was. I would keep a pack of foxhounds, and drink a bottle of wine a day."`,
  `"Then you would drink a great deal more than you ought," said Mrs. Bennet; "and if I were to see you at it, I should take away your bottle directly."`,
  `The boy protested that she should not; she continued to declare that she would, and the argument ended only with the visit.`,
];

export const P13B = [
  `The ladies of Longbourn soon waited on those of Netherfield. The visit was soon returned in due form. Miss Bennet's pleasing manners grew on the goodwill of Mrs. Hurst and Miss Bingley; and though the mother was found to be intolerable, and the younger sisters not worth speaking to, a wish of being better acquainted with _them_ was expressed towards the two eldest. By Jane, this attention was received with the greatest pleasure, but Elizabeth still saw superciliousness in their treatment of everybody, hardly excepting even her sister, and could not like them; though their kindness to Jane, such as it was, had a value as arising in all probability from the influence of their brother's admiration. It was generally evident whenever they met, that he _did_ admire her and to _her_ it was equally evident that Jane was yielding to the preference which she had begun to entertain for him from the first, and was in a way to be very much in love; but she considered with pleasure that it was not likely to be discovered by the world in general, since Jane united, with great strength of feeling, a composure of temper and a uniform cheerfulness of manner which would guard her from the suspicions of the impertinent. She mentioned this to her friend Miss Lucas.`,
  `"It may perhaps be pleasant," replied Charlotte, "to be able to impose on the public in such a case; but it is sometimes a disadvantage to be so very guarded. If a woman conceals her affection with the same skill from the object of it, she may lose the opportunity of fixing him; and it will then be but poor consolation to believe the world equally in the dark. There is so much of gratitude or vanity in almost every attachment, that it is not safe to leave any to itself. We can all _begin_ freely—a slight preference is natural enough; but there are very few of us who have heart enough to be really in love without encouragement. In nine cases out of ten a women had better show _more_ affection than she feels. Bingley likes your sister undoubtedly; but he may never do more than like her, if she does not help him on."`,
];

/** Page 14. Arrays are paragraphs read aloud phrase by phrase. */
export const P14: (string | string[])[] = [
  `"But she does help him on, as much as her nature will allow. If I can perceive her regard for him, he must be a simpleton, indeed, not to discover it too."`,
  `"Remember, Eliza, that he does not know Jane's disposition as you do."`,
  `"But if a woman is partial to a man, and does not endeavour to conceal it, he must find it out."`,
  [
    `"Perhaps he must, if he sees enough of her.`,
    ` But, though Bingley and Jane meet tolerably often,`,
    ` it is never for many hours together;`,
    ` and, as they always see each other in large mixed parties,`,
    ` it is impossible that every moment should be employed in conversing together.`,
    ` Jane should therefore make the most of every half-hour in which she can command his attention.`,
    ` When she is secure of him,`,
    ` there will be more leisure for falling in love as much as she chooses."`,
  ],
  [
    `"Your plan is a good one,"`,
    ` replied Elizabeth,`,
    ` "where nothing is in question but the desire of being well married,`,
    ` and if I were determined to get a rich husband, or any husband, I dare say I should adopt it.`,
    ` But these are not Jane's feelings; she is not acting by design. As yet, she cannot even be certain of the degree of her own regard nor of its reasonableness. She has known him only a fortnight. She danced four dances with him at Meryton; she saw him one morning at his own house, and has since dined with him in company four times. This is not quite enough to make her understand his character."`,
  ],
  `"Not as you represent it. Had she merely _dined_ with him, she might only have discovered whether he had a good appetite; but you must remember that four evenings have also been spent together—and four evenings may do a great deal."`,
  `"Yes; these four evenings have enabled them to ascertain that they both like Vingt-un better than Commerce; but with respect to any other leading characteristic, I do not imagine that much has been unfolded."`,
  `"Well," said Charlotte, "I wish Jane success with all my heart; and if she were married to him to-morrow, I should think she had as good a chance of happiness as if she were to be studying his character for a twelvemonth. Happiness in marriage is entirely a matter of chance. If the dispositions of the parties are ever so well known to each other or ever so similar beforehand, it does not advance their felicity in the least. They always continue to grow sufficiently unlike afterwards to have their share of vexation; and it is better to know as little as possible of the defects of the person with whom you are to pass your life."`,
  `"You make me laugh, Charlotte; but it is not sound. You know it is not sound, and that you would never act in this way yourself."`,
  `Occupied in observing Mr. Bingley's attentions to her sister, Elizabeth was far from suspecting that she was herself becoming an object of some interest in the eyes of his friend. Mr. Darcy had at first scarcely allowed her to be pretty; he looked at her without admiration at the ball; and when they next met, he looked at her only to criticise. But no sooner had he made it clear to himself and his friends that she hardly had a good feature in her face, than he began to find it was rendered uncommonly intelligent by the beautiful expression of her dark eyes. To this discovery succeeded some others equally mortifying. Though he had detected with a critical eye more than one failure of perfect symmetry in her form, he was forced to acknowledge her figure to be light and pleasing.`,
];

/** Lines exactly as the app breaks them; `e` ends a paragraph, `i` indents. */
export type Line = { t: string; e?: boolean; i?: boolean };
const L = (t: string, e = false, i = false): Line => ({ t, e, i });

export const ALICE: Line[][] = [
  [
    L("“Well, I’ll eat it,” said Alice, “and"),
    L("if it makes me grow larger, I can"),
    L("reach the key; and if it makes me"),
    L("grow smaller, I can creep under"),
    L("the door; so either way I’ll get"),
    L("into the garden, and I don’t care"),
    L("which happens!”", true),
    L("She ate a little bit, and said", false, true),
    L("anxiously to herself, “Which"),
    L("way? Which way?”, holding her"),
    L("hand on the top of her head to"),
    L("feel which way it was growing,"),
    L("and she was quite surprised to"),
  ],
  [
    L("find that she remained the same"),
    L("size: to be sure, this generally"),
    L("happens when one eats cake, but"),
    L("Alice had got so much into the"),
    L("way of expecting nothing but"),
    L("out-of-the-way things to happen,"),
    L("that it seemed quite dull and"),
    L("stupid for life to go on in the"),
    L("common way.", true),
    L("So she set to work, and very", false, true),
    L("soon finished off the cake.", true),
  ],
];

export const RAVEN: Line[] = [
  L("The secret of a poem, no less than a"),
  L("jest's prosperity, lies in the ear of him"),
  L("that hears it. Yield to its spell, accept"),
  L("the poet's mood: this, after all, is what"),
  L("the sages answer when you ask them of"),
];

const CJK =
  "個女學生，并兩個伴讀丫鬟，這女學生年又小，身体又极怯弱，工課不限多寡，故十分省力。堪堪又是一載的光陰，誰知女學生之母賈氏夫人一疾而終。女學生侍湯奉藥，守喪盡哀，遂又將辭館別圖。林如海意欲令女學生守制讀書，故又將他留下。近因女學生哀痛過傷，本自怯弱多病的，觸犯舊症，遂連日不曾上學。雨村閒居無聊，每當風日晴和，飯后便出來閒步。這日，偶至郭外，意欲賞鑒那村野風光，忽信步至一山環水旋，茂林深竹之處，隱隱的有座廟宇，門巷傾頹，牆垣朽敗，門前有額，題著「智通寺」三字，門旁又有一副舊破的對聯，曰：身後有餘忘縮手，眼前無路想回頭。";

/** Vertical columns of 19 characters, right to left. */
export const CHAMBER: string[] = Array.from({ length: 12 }, (_, i) => CJK.slice(i * 19, i * 19 + 19));

/**
 * Tiny inline markup: _italic_, [[mark]] (a word above the reader's level)
 * and [[!word]] (the selected word, which gets `selRef`).
 */
export function rich(
  s: string,
  opts: { marks?: boolean; selRef?: Ref<HTMLSpanElement>; counter?: { n: number } } = {},
): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /_([^_]+)_|\[\[(!?)([^\]]+)\]\]/g;
  let last = 0;
  let k = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s))) {
    if (m.index > last) out.push(s.slice(last, m.index));
    if (m[1] !== undefined) {
      out.push(<i key={k++}>{m[1]}</i>);
    } else {
      const sel = m[2] === "!";
      const n = opts.counter ? opts.counter.n++ : 0;
      out.push(
        <span
          key={k++}
          ref={sel ? opts.selRef : undefined}
          className={"mk" + (opts.marks ? " on" : "") + (sel && opts.marks ? " sel" : "")}
          style={{ transitionDelay: opts.marks ? `${n * 70}ms` : "0ms" }}
        >
          {m[3]}
        </span>,
      );
    }
    last = re.lastIndex;
  }
  if (last < s.length) out.push(s.slice(last));
  return out;
}
