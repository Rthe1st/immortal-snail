export default function Welcome(props: {
  playerLocationKnown: boolean;
  makeDeal: () => void;
}) {
  const { makeDeal, playerLocationKnown } = props;
  {
    /* todo: make the 2 paragraphs a bit more coherent */
  }
  return (
    <>
      <p>
        The legend of the Immortal Snail was whispered among the shadowy
        underworld of the city, a tale too strange to be believed but too
        alluring to be ignored. They said the snail was cursed with immortality,
        a shell-bound creature that defied death itself. But the catch was that
        if it touched anyone, that person would inherit the snail's immortality,
        and the snail would stop at nothing to hunt them down and claim what was
        rightfully its own. The story spread like wildfire, and soon enough,
        people were willing to pay a high price to catch the elusive snail and
        claim its immortality for themselves. But little did they know that the
        snail was not to be trifled with, and that its pursuit would lead them
        down a dark path of danger, betrayal, and the eternal curse of life
        without end.
      </p>
      <p>
        Are you tired of living in constant fear of the immortal snail? Do you
        want to prepare yourself to escape the snail's relentless pursuit? Look
        no further than our website dedicated to helping people practice
        escaping the immortal snail! Our website provides a safe and realistic
        environment for you to hone your skills and learn new tactics for
        evading the immortal snail. With a variety of challenges and scenarios,
        you'll be able to improve your agility, strategic thinking, and survival
        instincts. Our team of experts has years of experience in studying the
        immortal snail's behavior and can offer valuable insights into how to
        outsmart and outrun this elusive creature. Whether you're a seasoned
        survivor or a newbie looking to learn the ropes, our website has
        something for everyone. You'll have access to a supportive community of
        fellow escape artists who can offer advice, encouragement, and friendly
        competition. Plus, with regular updates and new challenges added all the
        time, you'll never get bored or complacent. Give yourself the confidence
        you need to touch the immortal snail when your chance comes.
      </p>
      {playerLocationKnown ? (
        <button onClick={makeDeal}>Make deal with snail</button>
      ) : (
        <p>Acquiring location</p>
      )}
    </>
  );
}
