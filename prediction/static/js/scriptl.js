document.addEventListener("DOMContentLoaded", function () {
  const itemData = JSON.parse(document.getElementById("item-data").textContent);

  //for display item from js object and back button functionality
  window.renderItems = function renderItems() {
    const itemsArea = document.querySelector(".itemsArea");
    itemsArea.innerHTML = "";

    itemData.forEach((item) => {
      const itemDiv = document.createElement("div");
      itemDiv.classList.add("itemSelectionArea");

      const imgElem = document.createElement("img");
      imgElem.src = item.imageUrl;
      imgElem.alt = item.itemName;
      imgElem.classList.add("itemPicture");

      const itemNameElem = document.createElement("span");
      itemNameElem.classList.add("itemName");
      itemNameElem.textContent = item.itemName;

      const lineBreak1 = document.createElement("br");
      const lineBreak2 = document.createElement("br");

      const itemDescriptionElem = document.createElement("span");
      itemDescriptionElem.classList.add("itemDescription");
      itemDescriptionElem.textContent = item.description;

      const commentCountElem = document.createElement("span");
      commentCountElem.classList.add("commentCount");
      commentCountElem.textContent = "Total Comments : " + item.commentCount;

      const commentTextarea = document.createElement("textarea");
      commentTextarea.classList.add("commentSection");
      commentTextarea.placeholder = "Enter Your Comment";

      const addReviewBtn = document.createElement("button");
      addReviewBtn.classList.add("addReview");
      addReviewBtn.textContent = "Add Review";
      addReviewBtn.onclick = () => {
        const itemId = item.id;
        const commentTxt = commentTextarea.value;
        const rangeVal = rangeInput.value;
        addReview(itemId, commentTxt, rangeVal);
      };
      // takeComment(item.id, commentTextarea.value, rangeInput.value);

      const addStatusBtn = document.createElement("button");
      addStatusBtn.classList.add("showStatus");
      addStatusBtn.textContent = "See Reviews";
      addStatusBtn.onclick = () =>
        showStatus(item.id, item.itemName, item.imageUrl, item.description);

      const rangeInput = document.createElement("input");
      rangeInput.classList.add("rangeMeter");
      rangeInput.type = "range";
      rangeInput.value = "50";

      itemDiv.appendChild(imgElem);
      itemDiv.appendChild(itemNameElem);
      itemDiv.appendChild(lineBreak1);
      itemDiv.appendChild(itemDescriptionElem);
      itemDiv.appendChild(lineBreak2);

      itemDiv.appendChild(commentCountElem);
      itemDiv.appendChild(commentTextarea);
      itemDiv.appendChild(addReviewBtn);
      itemDiv.appendChild(addStatusBtn);
      itemDiv.appendChild(rangeInput);

      itemsArea.appendChild(itemDiv);
    });
  };
  function addReview(itemId, commentTxt, rangeVal) {
    itemData.forEach((item) => {
      if (item.id == itemId) {
        item.commentCount++;
        renderItems();
        updateReviewData(item.id, commentTxt, rangeVal);
      }
    });
  }

  async function updateReviewData(itemId, commentTxt, rangeVal) {
    try {
      const response = await fetch("review_submit/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"),
        },
        body: JSON.stringify({
          itemId: itemId,
          commentTxt: commentTxt,
          rangeVal: rangeVal,
        }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, response: ${errorText}`
        );
      }
      else {
        location.reload();
      }

      const result = await response.json();
      console.log("Success: ", result);
    } catch (error) {
      console.error("Error: ", error);
    }
  }

  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  window.search = function search() {
    const searchItm = document.getElementsByClassName("searchArea");
    searchItmValue = searchItm[0].value.toLowerCase();

    const itemsArea = document.querySelector(".itemsArea");
    itemsArea.innerHTML = "";

    itemData.forEach((item) => {
      if (item.itemName.toLowerCase() == searchItmValue) {
        console.log("ok");
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("itemSelectionArea");

        const imgElem = document.createElement("img");
        imgElem.src = item.imageUrl;
        imgElem.alt = item.itemName;
        imgElem.classList.add("itemPicture");

        const itemNameElem = document.createElement("span");
        itemNameElem.classList.add("itemName");
        itemNameElem.textContent = item.itemName;

        const lineBreak1 = document.createElement("br");
        const lineBreak2 = document.createElement("br");

        const itemDescriptionElem = document.createElement("span");
        itemDescriptionElem.classList.add("itemDescription");
        itemDescriptionElem.textContent = item.description;

        const commentCountElem = document.createElement("span");
        commentCountElem.classList.add("commentCount");
        commentCountElem.textContent = "Total Comments : " + item.commentCount;

        const commentTextarea = document.createElement("textarea");
        commentTextarea.classList.add("commentSection");
        commentTextarea.placeholder = "Enter Your Comment";

        const addReviewBtn = document.createElement("buttom");
        addReviewBtn.classList.add("addReview");
        addReviewBtn.textContent = "Add Review";
        addReviewBtn.onclick = () =>
          addReview(item.id, commentTextarea.value, rangeInput.value);

        const addStatusBtn = document.createElement("button");
        addStatusBtn.classList.add("showStatus");
        addStatusBtn.textContent = "See Reviews";
        addStatusBtn.onclick = () =>
          showStatus(item.id, item.itemName, item.imageUrl, item.description);

        const rangeInput = document.createElement("input");
        rangeInput.classList.add("rangeMeter");
        rangeInput.type = "range";
        rangeInput.value = "50";

        itemDiv.appendChild(imgElem);
        itemDiv.appendChild(itemNameElem);
        itemDiv.appendChild(lineBreak1);
        itemDiv.appendChild(itemDescriptionElem);
        itemDiv.appendChild(lineBreak2);

        itemDiv.appendChild(commentCountElem);
        itemDiv.appendChild(commentTextarea);
        itemDiv.appendChild(addReviewBtn);
        itemDiv.appendChild(addStatusBtn);
        itemDiv.appendChild(rangeInput);

        itemsArea.appendChild(itemDiv);
        document.addEventListener("DOMContentLoaded", renderItems);
      }
    });
  };

  function showStatus(itemId, name, url, description) {
    const itemsArea = document.querySelector(".itemsArea");
    itemsArea.innerHTML = "";

    const itemDiv = document.createElement("div");
    itemDiv.classList.add("itemSelectionAreaReview");

    const imgElem = document.createElement("img");
    imgElem.src = url;
    imgElem.alt = name;
    imgElem.classList.add("itemPicture");

    const itemNameElem = document.createElement("span");
    itemNameElem.classList.add("itemName");
    itemNameElem.textContent = name;

    const lineBreak1 = document.createElement("br");

    const itemDescriptionElem = document.createElement("span");
    itemDescriptionElem.classList.add("itemDescription");
    itemDescriptionElem.textContent = description;

    itemDiv.appendChild(imgElem);
    itemDiv.appendChild(itemNameElem);
    itemDiv.appendChild(lineBreak1);
    itemDiv.appendChild(itemDescriptionElem);
    itemsArea.appendChild(itemDiv);

    itemData.forEach((item) => {
      if (item.id == itemId) {
        item.reviewInfo.forEach((reviewDet) => {
          const rendComments = document.createElement("div");
          rendComments.classList.add("rendComments");

          const CommentsTxt = document.createElement("span");
          CommentsTxt.classList.add("renderCommentsTxt");
          CommentsTxt.innerHTML = "Comment : <br /> " + reviewDet.commentTxt;

          const lineBreak2 = document.createElement("br");

          const CommentsVal = document.createElement("span");
          CommentsVal.classList.add("rendCommentsVal");
          CommentsVal.innerHTML = "Score : <br />" + reviewDet.value + "/100";

          const sentiment = document.createElement("span");
          sentiment.classList.add("rendSentiment");
          sentiment.innerHTML = reviewDet.sentiment;


          if (reviewDet.sentiment === "Positive") {
            sentiment.style.backgroundColor = "rgba(4, 119, 11, 0.71)";
          } else {
            sentiment.style.backgroundColor = "rgba(237, 20, 5, 0.71)";
          }

          itemsArea.appendChild(rendComments);
          rendComments.appendChild(sentiment);
          rendComments.appendChild(CommentsTxt);
          rendComments.appendChild(lineBreak2);
          rendComments.appendChild(CommentsVal);
          rendComments.appendChild(lineBreak2);
        });
      }
    });
  }

  renderItems();
});
