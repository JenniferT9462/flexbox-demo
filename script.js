 
    // Each screen sets the container's styles, every card's styles, card 1's extra
    // styles (first), the width, and the words. The caption is the SAY line.
    let flexBreakdown =
      "flex: 1 1 200px;\n" +
      "      ↑ ↑ ↑\n" +
      "      │ │ └ start size (flex-basis)\n" +
      "      │ └ shrink? 1 = yes, 0 = no\n" +
      "      └ grow?   1 = yes, 0 = no";

    let screens = [
      {
        cards: {}, card: {},
        caption: "Three cards inside a container. Divs are block elements, so they stack top to bottom.",
        note: "Each card takes the whole width of the line, even though its words are short.",
        code: ".cards {\n}"
      },
      {
        cards: { display: "flex" }, card: {},
        caption: "Put display: flex on the container. The boxes directly inside it line up in a row.",
        note: "Flex goes on the PARENT. The cards are now \"flex items\". They're only as wide as their words.",
        code: ".cards {\n  display: flex;\n}"
      },
      {
        cards: { display: "flex" }, card: {},
        caption: "Why so narrow? Every flex item gets a hidden default: flex: 0 1 auto.",
        note: "0 = don't grow. auto = as wide as what's inside: the text + padding + border. Block says \"give me the whole line\". Flex items say \"just give me what I need\".",
        code: "/* You don't write this. The browser does. */\n.card {\n  flex: 0 1 auto;\n}       ↑   ↑\n        │   └ as wide as what's inside\n        └ don't grow"
      },
      {
        cards: { display: "flex", gap: "16px" }, card: {},
        caption: "gap adds space between the cards. No margins needed.",
        note: "gap only goes BETWEEN cards, not around the outside. The space at the edges is the container's padding.",
        code: ".cards {\n  display: flex;\n  gap: 16px;\n}"
      },
      {
        cards: { display: "flex", gap: "16px" }, card: { flex: "1 1 200px" },
        caption: "Next, the flex property goes on each card. It's three settings in one line.",
        note: "Grow, shrink, and a start size. Let's turn them on one at a time.",
        code: ".card {\n  " + flexBreakdown.split("\n").join("\n  ") + "\n}"
      },
      {
        cards: { display: "flex", gap: "16px" }, card: { flex: "0 0 200px" },
        caption: "The third number is the start size. Every card starts at 200px wide.",
        note: "0 0 means: don't grow, don't shrink. See the empty space on the right? Nobody is using it.",
        code: ".card {\n  flex: 0 0 200px;\n}           ↑\n        start size"
      },
      {
        cards: { display: "flex", gap: "16px" }, card: { flex: "1 0 200px" },
        caption: "The first number is grow. 1 means: share the empty space.",
        note: "Each card gets an equal slice of the leftover space, so together they fill the row.",
        code: ".card {\n  flex: 1 0 200px;\n}       ↑\n      grow"
      },
      {
        cards: { display: "flex", gap: "16px" }, card: { flex: "1 0 200px" }, narrow: true,
        caption: "Same code. Now the screen gets narrower. Watch the cards spill out of the box!",
        note: "That's the second number, shrink. 0 means never smaller than 200px, and three 200px cards don't fit.",
        code: ".card {\n  flex: 1 0 200px;\n}         ↑\n       shrink"
      },
      {
        cards: { display: "flex", gap: "16px" }, card: { flex: "1 1 200px" }, narrow: true,
        caption: "Shrink 1 means: you're allowed to get smaller than 200px. Now they squeeze to fit.",
        note: "That works here, but on a phone the cards would get squashed too thin to read.",
        code: ".card {\n  flex: 1 1 200px;\n}         ↑\n       shrink"
      },
      {
        cards: { display: "flex", gap: "16px", flexWrap: "wrap" }, card: { flex: "1 1 200px" }, narrow: true,
        caption: "flex-wrap: wrap lets a card drop to a new line when it doesn't fit.",
        note: "Card 3 still has grow 1, so it stretches across its whole new line. wrap goes on the container, not the card.",
        code: ".cards {\n  display: flex;\n  gap: 16px;\n  flex-wrap: wrap;\n}"
      },
      {
        cards: { display: "flex", gap: "16px", flexWrap: "wrap" }, card: { flex: "1 1 200px" },
        caption: "Read flex: 1 1 200px as: start at 200px, grow if there's room, shrink if there isn't.",
        note: "With flex-wrap on the container, that's the whole card row. You'll also see flex: 1 online. It means \"all share the space equally\".",
        code: flexBreakdown
      },
      {
        cards: { display: "flex", gap: "16px", flexDirection: "column" }, card: {},
        label: "form (the container)",
        caption: "flex-direction: column lines them up top to bottom, with even gaps. That's how we lay out the form.",
        note: "Same idea, other direction. gap now makes the space between the form fields.",
        code: "form {\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n}"
      },
      {
        cards: {}, card: { display: "flex", gap: "16px" },
        caption: "Common mistake: display: flex on .card instead of .cards. The cards still stack.",
        note: "Each card is now a flex container for its own words, not the row. Look for the s: .cards is the parent.",
        code: ".card {\n  display: flex;  ← wrong box!\n}"
      },
      {
        cards: { display: "flex", gap: "16px" }, card: { flex: "1 0 200px" }, first: { flex: "2 0 200px" },
        caption: "Bonus: the grow number is a share. Card 1 has 2, the others have 1.",
        note: "So card 1 gets twice as much of the EXTRA space: about 49px extra, the others about 25px. It is not twice as wide.",
        code: ".card       { flex: 1 0 200px; }\n.card.big   { flex: 2 0 200px; }"
      }
    ];

    let current = 0;
    let container = document.querySelector("#cards");
    let cards = document.querySelectorAll(".card");
    let measureTimer;

    // Write each card's real width inside it
    function measure() {
      cards.forEach(function (card) {
        card.querySelector(".size").textContent = Math.round(card.getBoundingClientRect().width) + "px wide";
      });
    }

    function show() {
      let screen = screens[current];
      document.querySelector("#step").textContent = "Screen " + (current + 1) + " of " + screens.length;
      document.querySelector("#caption").textContent = screen.caption;
      document.querySelector("#note").textContent = screen.note;
      document.querySelector("#code").textContent = screen.code;
      document.querySelector("#label").textContent = screen.label || ".cards (the container)";

      container.removeAttribute("style");
      Object.assign(container.style, screen.cards);
      container.classList.toggle("narrow", !!screen.narrow);
      cards.forEach(function (card, i) {
        card.removeAttribute("style");
        Object.assign(card.style, screen.card);
        if (i === 0 && screen.first) { Object.assign(card.style, screen.first); }
        card.classList.toggle("big", i === 0 && !!screen.first);
      });
      cards[0].querySelector(".name").textContent = screen.first ? "card 1 (big)" : "card 1";

      // Measure now, and again after the width animation finishes
      measure();
      clearTimeout(measureTimer);
      measureTimer = setTimeout(measure, 650);

      document.querySelector("#back").disabled = current === 0;
      document.querySelector("#next").disabled = current === screens.length - 1;
    }

    function next() {
      if (current < screens.length - 1) { current = current + 1; show(); }
    }
    function back() {
      if (current > 0) { current = current - 1; show(); }
    }

    document.querySelector("#next").addEventListener("click", next);
    document.querySelector("#back").addEventListener("click", back);
    document.addEventListener("keydown", function (event) {
      if (event.key === "ArrowRight") { next(); }
      if (event.key === "ArrowLeft") { back(); }
    });
    window.addEventListener("resize", measure);

    // Optional: flexbox-demo.html#5 opens on screen 5
    let start = parseInt(location.hash.slice(1));
    if (start >= 1 && start <= screens.length) { current = start - 1; }

    show();
