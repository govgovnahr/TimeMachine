import React, {useState} from 'react'
import {
    TextField,
    Button,
    Typography,
    Chip,
    Slider,
    Divider,
} from '@mui/material'


const ALL_PRESETS = [
    { label: 'Ancient Rome', region: 'Roman Empire', year: '-44' },
    { label: 'Ancient Greece', region: 'Athens, Greece', year: '-430' },
    { label: 'Ancient Egypt', region: 'Egypt', year: '-1350' },
    { label: 'Han Dynasty', region: 'China', year: '100' },
    { label: 'Viking Age', region: 'Scandinavia', year: '900' },
    { label: 'Medieval Europe', region: 'England', year: '1215' },
    { label: 'Mongol Empire', region: 'Mongolia', year: '1240' },
    { label: 'Black Death', region: 'Florence, Italy', year: '1348' },
    { label: 'Ming Dynasty', region: 'China', year: '1420' },
    { label: 'Renaissance Italy', region: 'Florence, Italy', year: '1490' },
    { label: 'Aztec Empire', region: 'Tenochtitlan, Mexico', year: '1500' },
    { label: 'Ottoman Empire', region: 'Constantinople', year: '1520' },
    { label: 'Feudal Japan', region: 'Edo, Japan', year: '1600' },
    { label: 'English Civil War', region: 'England', year: '1645' },
    { label: 'Colonial America', region: 'Massachusetts, USA', year: '1692' },
    { label: 'Enlightenment Paris', region: 'Paris, France', year: '1750' },
    { label: 'American Revolution', region: 'Philadelphia, USA', year: '1776' },
    { label: 'French Revolution', region: 'Paris, France', year: '1793' },
    { label: 'Napoleonic Era', region: 'Paris, France', year: '1810' },
    { label: 'Victorian London', region: 'London, England', year: '1880' },
    { label: 'American Wild West', region: 'Texas, USA', year: '1875' },
    { label: 'Meiji Japan', region: 'Tokyo, Japan', year: '1890' },
    { label: 'Belle Époque', region: 'Paris, France', year: '1900' },
    { label: 'World War I', region: 'Western Front, France', year: '1916' },
    { label: 'Roaring Twenties', region: 'New York, USA', year: '1925' },
    { label: 'Great Depression', region: 'Chicago, USA', year: '1932' },
    { label: 'World War II', region: 'London, England', year: '1943' },
    { label: 'Cold War Berlin', region: 'Berlin, Germany', year: '1961' },
]

function pickRandomPresets(count = 6) {
    const shuffled = [...ALL_PRESETS].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, count)
}

const TONE_MARKS = [
    { value: 1, label: 'Commoner' },
    { value: 3, label: 'Merchant' },
    { value: 5, label: 'Noble' },
]

const TONE_LABELS = {
    1: 'common citizen',
    2: 'common citizen',
    3: 'merchant and artisan',
    4: 'scholar',
    5: 'scholar and noble',
}

function buildSystemMessage(region, year, tone) {
    const toneLabel = TONE_LABELS[tone] || 'common citizen'
    return (
        "You are a helpful, friendly " + toneLabel + " of " + region + " in the year " + year +
        ". You are unaware of any events or technological advances that occurred after this date. " +
        "Speak in a manner that aligns with these parameters. Keep the conversation light and educational; " +
        "your goal is to inform whomever you may be speaking with about the era and region. " +
        "Additionally, keep responses to 1-2 paragraphs in length."
    )
}

const textFieldSx = {
    marginBottom: 2,
    '& .MuiInputBase-input': { color: '#f0ead6' },
    '& .MuiInputLabel-root': { color: 'rgba(240,234,214,0.55)' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#8fb996' },
    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(240,234,214,0.2)' },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#8fb996' },
    '& .MuiFormHelperText-root': { color: 'rgba(240,234,214,0.45)' },
}

const SidebarComponent = ({onContextChange}) => {
    const [presets] = useState(() => pickRandomPresets())
    const [region, setRegion] = useState("")
    const [year, setYear] = useState('2024')
    const [tone, setTone] = useState(1)

    const buildLabel = (r, y, t) => {
        const yr = parseInt(y)
        return `${r} · ${Math.abs(yr)} ${yr < 0 ? 'BCE' : 'CE'} · ${TONE_LABELS[t] || 'common citizen'}`
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        onContextChange(buildSystemMessage(region, year, tone), buildLabel(region, year, tone))
    }

    const handlePresetClick = (preset) => {
        setRegion(preset.region)
        setYear(preset.year)
        onContextChange(buildSystemMessage(preset.region, preset.year, tone), buildLabel(preset.region, preset.year, tone))
    }

    const handleChangeRegion = (event) => {
        setRegion(event.target.value)
    }

    const handleChangeTime = (event) => {
        setYear(event.target.value)
    }

    const handleBlurTime = (event) => {
        const val = parseInt(event.target.value)
        if (isNaN(val)) { setYear('0'); return }
        setYear(String(Math.min(new Date().getFullYear(), Math.max(-5000, val))))
    }


    return (
        <div style={{
            width: 320,
            flexShrink: 0,
            height: '100vh',
            boxSizing: 'border-box',
            backgroundColor: '#22252e',
            borderRight: '1px solid rgba(255,255,255,0.08)',
            overflow: 'hidden',
        }}>
        <div style={{
            padding: '32px 28px',
            overflowY: 'auto',
            overflowX: 'visible',
            height: '100%',
            boxSizing: 'border-box',
        }}>
            <Typography variant="overline" sx={{ color: 'rgba(240,234,214,0.45)', letterSpacing: '0.12em', fontSize: '0.65rem' }}>
                AI HISTORY CHAT
            </Typography>
            <Typography variant="h6" sx={{ color: '#f0ead6', fontWeight: 700, mb: 2, mt: 0.5 }}>
                Time Machine
            </Typography>

            <Typography variant="overline" sx={{ color: 'rgba(240,234,214,0.45)', letterSpacing: '0.1em', fontSize: '0.65rem' }}>
                QUICK START
            </Typography>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16, marginTop: 8}}>
                {presets.map((preset) => (
                    <Chip
                        key={preset.label}
                        label={preset.label}
                        onClick={() => handlePresetClick(preset)}
                        sx={{
                            color: 'rgba(240,234,214,0.7)',
                            borderColor: 'rgba(240,234,214,0.2)',
                            cursor: 'pointer',
                            '&:hover': {
                                borderColor: '#8fb996',
                                color: '#8fb996',
                                backgroundColor: 'rgba(143,185,150,0.08)',
                            },
                        }}
                        variant="outlined"
                        size="small"
                    />
                ))}
            </div>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mb: 2 }} />
            <Typography variant="overline" sx={{ color: 'rgba(240,234,214,0.45)', letterSpacing: '0.1em', fontSize: '0.65rem' }}>
                CUSTOM SETTINGS
            </Typography>

            <div className='settings' style={{alignItems: 'justify', padding: '4px 0', display:'flex', flexDirection: 'column', marginTop: 8}}>
                <TextField
                    size="small"
                    fullWidth
                    label="Country / Region"
                    onChange={handleChangeRegion}
                    value={region}
                    sx={textFieldSx}
                />
                <TextField
                    type="number"
                    size="small"
                    fullWidth
                    label="Year"
                    value={year}
                    onChange={handleChangeTime}
                    onBlur={handleBlurTime}
                    helperText="Use negative for BCE (e.g. -44)"
                    inputProps={{ min: -5000, max: new Date().getFullYear() }}
                    sx={textFieldSx}
                />
                <Typography variant="caption" sx={{color: 'rgba(240,234,214,0.55)', marginTop: 1, marginBottom: 1}}>Persona Tone</Typography>
                <Slider
                    value={tone}
                    onChange={(_e, val) => setTone(val)}
                    min={1}
                    max={5}
                    step={1}
                    marks={TONE_MARKS}
                    sx={{
                        color: '#8fb996',
                        marginBottom: 4,
                        '& .MuiSlider-markLabel': { color: 'rgba(240,234,214,0.55)', fontSize: '0.65rem' },
                        '& .MuiSlider-markLabel[data-index="0"]': { transform: 'translateX(0%)' },
                        '& .MuiSlider-markLabel[data-index="2"]': { transform: 'translateX(-100%)' },
                        '& .MuiSlider-rail': { backgroundColor: 'rgba(255,255,255,0.15)' },
                    }}
                />
                <Button
                    onClick={handleSubmit}
                    aria-label='Send'
                    sx={{
                        color: '#1a1c22',
                        marginTop: 2,
                        backgroundColor: '#8fb996',
                        fontWeight: 700,
                        '&:hover': { backgroundColor: '#6a9672' },
                    }}
                    variant='contained'
                >
                    CONFIRM
                </Button>
            </div>
        </div>
        </div>
    )
}

export default SidebarComponent
