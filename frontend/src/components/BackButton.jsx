import { Link } from "react-router-dom"
import { FaArrowCircleLeft } from "react-icons/fa"
import Button from "react-bootstrap/Button"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { reset } from "../features/tag/tagSlice"

const BackButton = ({url}) => {
    const {postByTag} = useSelector((state) => state.tag);
    const dispatch = useDispatch();

    useEffect(() => {
            dispatch(reset())   
    }, [dispatch, reset]);

    return (
        <> 
            <Link to={url}>
                <Button variant="outline-secondary">
                    <FaArrowCircleLeft /> Back
                </Button>
            </Link>
        </>
    )
}

export default BackButton