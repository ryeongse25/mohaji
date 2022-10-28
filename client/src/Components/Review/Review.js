const Review = (props) => {
    return (
        <div>
            <p>{props.id}</p>
            <p>{props.score}</p>
            <p>{props.review == null ? "" : props.review}</p>
            <p>{props.date.slice(0, 10)}</p>
            {props.file != false && <img src={"/img/review_img/" + props.file} style={{width: "200px"}}/>}
            {props.id == props.login_id && <div><button>수정</button><button onClick={props.deleteReview}>삭제</button></div>}
            <hr style={{border: "1px solid black", width: "100%"}}/>
        </div>
    )
}

export default Review;