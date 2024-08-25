import React, {useState} from 'react'
import Datetime from 'react-datetime'
import "react-datetime/css/react-datetime.css";
import DateTimePicker from 'react-datetime-picker';
import dayjs from 'dayjs';
import moment from 'moment'
import {
    TextField,
    Button,
    Input,
    InputBase,
    IconButton,
    Paper,
    OutlinedInput,
    Typography
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


moment().format()

const SidebarComponent = ({onContextChange}) => {
    const [region, setRegion] = useState("")
    const [year, setYear] = useState('2024')

    const handleSubmit = (event) => {
        console.log("Region",region)
        console.log("Year", year)
        event.preventDefault();
        let systemMessage = ''
        systemMessage = "You are a helpful, friendly, regular citizen of " + region + " in the year " + year + " . You are unaware of any events or technological advances that occurred after this date. Speak in a manner that aligns with these parameters. Keep the conversation light and educational; your goal is to inform whomever you may be speaking with about the era and region. Additionally, keep responses to 1-2 paragraphs in length."
        onContextChange(systemMessage)
    }

    const handleChangeRegion = (event) => {
        setRegion(event.target.value)
        console.log(region)
    }

    const handleChangeTime = (event) => {
        setYear(event.target.value)
        console.log(year)
    }


    return (
        <div style={{padding: 40}}>
            <Typography variant="h4">Time Machine</Typography>
            <div className='settings' style={{alignItems: 'justify', padding: 3, display:'flex', flexDirection: 'column'}}>
                <Input onChange={handleChangeRegion} placeholder="Country/Region"  sx={{color: 'white', marginBottom: 2}} />
                <DatePicker minDate={dayjs("01/01/1000")} onChange={(date) => setYear(date.year().toString())} label={"Year"} yearsPerRow={4} disableFuture views={["year"]} sx={{color:'white'}}/>
                <Input onChange={handleChangeTime} placeholder="Or enter earlier year"  sx={{color: 'white', marginBottom: 2}} />
                {/* <Datetime onChange={(date) => setYear(date.year())} dateFormat='YYYY' sx={{color: 'red'}}/> */}
                {/* <DateTimePicker onChange={(date) => setYear(date.year())} dateFormat='y' sx={{color: 'red'}}/> */}
                <Button onClick={handleSubmit} aria-label='Send'sx={{color: 'white', marginTop: 2}} variant='contained'>CONFIRM</Button>
            </div>
        </div>
    )
}

export default SidebarComponent