console.log('Script starting');

// Check core dependencies
console.log('jQuery:', typeof jQuery !== 'undefined');
console.log('wp:', typeof wp !== 'undefined');
console.log('wp.element:', wp?.element ? 'available' : 'missing');

function Counter({ value, onChange, min, max, step = 1, label }) {
        return wp.element.createElement(
            'div',
            { className: 'counter-container' },
            [
                wp.element.createElement('span', { key: 'label' }, label),
                wp.element.createElement(
                    'div',
                    { key: 'controls', className: 'counter-controls' },
                    [
                        wp.element.createElement(
                            'button',
                            {
                                key: 'minus',
                                onClick: () => onChange(Math.max(min, value - step)),
                                disabled: value <= min,
                                className: 'counter-button'
                            },
                            '-'
                        ),
                        wp.element.createElement(
                            'span',
                            { key: 'value', className: 'counter-value' },
                            value
                        ),
                        wp.element.createElement(
                            'button',
                            {
                                key: 'plus',
                                onClick: () => onChange(Math.min(max, value + step)),
                                disabled: value >= max,
                                className: 'counter-button'
                            },
                            '+'
                        )
                    ]
                )
            ]
        );
    }

function ListingFlow() {
    const { useState, useEffect, useRef } = wp.element;
    
    const formatNumberWithCommas = (value) => {
        if (!value) return '0';
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };
    
    const [step, setStep] = useState('structure');
    const [progress, setProgress] = useState(0);
    const [fadeOut, setFadeOut] = useState(false);
    const [address, setAddress] = useState('');
    const [location, setLocation] = useState(null);
    const [guests, setGuests] = useState(3);
    const [bathrooms, setBathrooms] = useState(3);
    const [bedrooms, setBedrooms] = useState(3);
    const [beds, setBeds] = useState(3);
    const mapRef = useRef(null);
    const autocompleteRef = useRef(null);
    const markerRef = useRef(null);
    const [selectedAmenities, setSelectedAmenities] = useState(new Set());
    const [rooms, setRooms] = useState([]);
    const [editingRoom, setEditingRoom] = useState(null);
    const [photos, setPhotos] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [showServiceFeeInfo, setShowServiceFeeInfo] = useState(false);
    const [showTotalInfo, setShowTotalInfo] = useState(false);
    const [showEarningsInfo, setShowEarningsInfo] = useState(false);
    const [allowEvents, setAllowEvents] = useState(false);
    const [selectedEvents, setSelectedEvents] = useState([]);
    const [otherEventText, setOtherEventText] = useState('');
    const [eventAttendees, setEventAttendees] = useState('');
    const [allowPets, setAllowPets] = useState(false);
    const [petCount, setPetCount] = useState(1);
    const [allowedPets, setAllowedPets] = useState([]);
    const [dogSize, setDogSize] = useState('');
    const [allowChildren, setAllowChildren] = useState(false);
    const [allowedAgeGroups, setAllowedAgeGroups] = useState([]);
    const [allowSmoking, setAllowSmoking] = useState(false);
    const [smokingLocations, setSmokingLocations] = useState([]);
    const [certainRoomsText, setCertainRoomsText] = useState('');
    const [showPetFeeInfo, setShowPetFeeInfo] = useState(false);
    const [showNewKidInfo, setShowNewKidInfo] = useState(false);
    const [showWeekInfo, setShowWeekInfo] = useState(false);
    const [showMonthInfo, setShowMonthInfo] = useState(false);
    const [newKidDiscount, setNewKidDiscount] = useState(false);
    const [weekDiscount, setWeekDiscount] = useState(false);
    const [monthDiscount, setMonthDiscount] = useState(false);

const handlePhotos = (files) => {
    const newPhotos = Array.from(files).map(file => ({
        id: Date.now() + Math.random(),
        file: file,
        url: URL.createObjectURL(file)
    }));
    setPhotos(prev => [...prev, ...newPhotos]);
};

const removePhoto = (photoId) => {
    setPhotos(prev => prev.filter(photo => photo.id !== photoId));
};

const reorderPhotos = (startIndex, endIndex) => {
    const newPhotos = [...photos];
    const [removed] = newPhotos.splice(startIndex, 1);
    newPhotos.splice(endIndex, 0, removed);
    setPhotos(newPhotos);
};
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showRoomTypeModal, setShowRoomTypeModal] = useState(false);
    const [deleteRoomId, setDeleteRoomId] = useState(null);
    const [sleepSpaceLocation, setSleepSpaceLocation] = useState('');
    const locations = ['Living Room', 'Office', 'Finished Basement'];

const handleRoomDelete = () => {
    setRooms(rooms.filter(room => room.id !== deleteRoomId));
    setShowDeleteModal(false);
    setDeleteRoomId(null);
};

const handleRoomSave = (roomData) => {
    if (!roomData.name) {
        return;
    }
    
    let updatedRoomData = { ...roomData };
    
    if (roomData.type === 'bathroom') {
        if (!roomData.amenities || roomData.amenities.length === 0) {
            return;
        }
        const validatedAmenities = roomData.amenities.filter(amenity => amenity.quantity > 0);
        if (validatedAmenities.length === 0) {
            return;
        }
        updatedRoomData.amenities = validatedAmenities;
    } else {
        if (!roomData.beds || roomData.beds.length === 0) {
            return;
        }
        const validatedBeds = roomData.beds.filter(bed => bed.quantity > 0);
        if (validatedBeds.length === 0) {
            return;
        }
        updatedRoomData.beds = validatedBeds;
    }

    setRooms(prevRooms => {
        const roomIndex = prevRooms.findIndex(r => r.id === updatedRoomData.id);
        if (roomIndex >= 0) {
            const newRooms = [...prevRooms];
            newRooms[roomIndex] = updatedRoomData;
            return newRooms;
        }
        return [...prevRooms, updatedRoomData];
    });
    setShowEditModal(false);
    setEditingRoom(null);
};

        const propertyTypes = [
            { id: 'house', name: 'Home', icon: 'https://goblbs.com/wp-content/uploads/2024/11/HOUSE-ICON.png' },
            { id: 'car', name: 'Automobile', icon: 'https://goblbs.com/wp-content/uploads/2024/11/CAR-ICON.png' },
            { id: 'boat', name: 'Boat', icon: 'https://goblbs.com/wp-content/uploads/2024/11/BOAT-ICON.png' },
            { id: 'mountain', name: 'Experience', icon: 'https://goblbs.com/wp-content/uploads/2024/11/MOUNTAIN-ICON.png' }
        ];

        const spaceTypes = [
    { id: 'entire', name: 'Full Home', icon: 'https://goblbs.com/wp-content/uploads/2024/11/HOUSE-ICON.png' },
    { id: 'private', name: 'Private Room', icon: 'https://goblbs.com/wp-content/uploads/2024/11/BED-ICON.png' },
    { id: 'shared', name: 'Shared Room', icon: 'https://goblbs.com/wp-content/uploads/2024/11/TWIN-BED-ICON.png' }
];

const bedTypes = {
    king: { name: 'King', icon: 'https://goblbs.com/wp-content/uploads/2024/11/BED-ICON.png' },
    queen: { name: 'Queen', icon: 'https://goblbs.com/wp-content/uploads/2024/11/BED-ICON.png' },
    double: { name: 'Double', icon: 'https://goblbs.com/wp-content/uploads/2024/11/BED-ICON.png' },
    twin: { name: 'Twin', icon: 'https://goblbs.com/wp-content/uploads/2024/11/TWIN-CHILD.png' },
    child: { name: 'Child', icon: 'https://goblbs.com/wp-content/uploads/2024/11/TWIN-CHILD.png' },
    bunk: { name: 'Bunk', icon: 'https://goblbs.com/wp-content/uploads/2024/11/BUNK.png' },
    sofa: { name: 'Sofa', icon: 'https://goblbs.com/wp-content/uploads/2024/11/SOFABED.png' },
    futon: { name: 'Futon', icon: 'https://goblbs.com/wp-content/uploads/2024/11/FUTON.png' },
    murphy: { name: 'Murphy', icon: 'https://goblbs.com/wp-content/uploads/2024/11/MURPHY.png' },
    crib: { name: 'Crib', icon: 'https://goblbs.com/wp-content/uploads/2024/11/CRIB.png' }
};

const bathroomTypes = {
    bathtub: { name: 'Bathtub', icon: 'https://goblbs.com/wp-content/uploads/2024/11/BATHTUB.png' },
    shower: { name: 'Shower', icon: 'https://goblbs.com/wp-content/uploads/2024/11/OUTDOOR-SHOWER.png' },
    toilet: { name: 'Toilet', icon: 'https://goblbs.com/wp-content/uploads/2024/11/TOILET.png' },
    jetted: { name: 'Jetted Bathtub', icon: 'https://goblbs.com/wp-content/uploads/2024/11/JETTUB.png' },
    bidet: { name: 'Bidet', icon: 'https://goblbs.com/wp-content/uploads/2024/11/BIDET.png' },
    doubleVanity: { name: 'Double Vanity', icon: 'https://goblbs.com/wp-content/uploads/2024/11/DOUBLEVANITY.png' }
};

const amenityGroups = {
    indoor: {
        title: 'Indoor',
        items: [
            { id: 'kitchen', name: 'Kitchen', icon: 'https://goblbs.com/wp-content/uploads/2024/11/KITCHEN-ICON.png' },
            { id: 'workspace', name: 'Workspace', icon: 'https://goblbs.com/wp-content/uploads/2024/11/WORKSPACE-ICON.png' },
            { id: 'drier', name: 'Drier', icon: 'https://goblbs.com/wp-content/uploads/2024/11/DRIER-ICON.png' },
            { id: 'washer', name: 'Washer', icon: 'https://goblbs.com/wp-content/uploads/2024/11/WASHER-ICON.png' },
            { id: 'fireplace', name: 'Fireplace', icon: 'https://goblbs.com/wp-content/uploads/2024/11/FIREPLACE.png' },
            { id: 'ac', name: 'Air Conditioning', icon: 'https://goblbs.com/wp-content/uploads/2024/11/AC-1.png' },
            { id: 'heat', name: 'Heat', icon: 'https://goblbs.com/wp-content/uploads/2024/11/HEAT.png' },
            { id: 'garage', name: 'Garage', icon: 'https://goblbs.com/wp-content/uploads/2024/11/GARAGE.png' },
            { id: 'bathtub', name: 'Bathtub', icon: 'https://goblbs.com/wp-content/uploads/2024/11/BATHTUB.png' }
        ]
    },
    outdoor: {
        title: 'Outdoor',
        items: [
            { id: 'patio', name: 'Patio', icon: 'https://goblbs.com/wp-content/uploads/2024/11/PATIO.png' },
            { id: 'bbq', name: 'BBQ Grill', icon: 'https://goblbs.com/wp-content/uploads/2024/11/BBQ.png' },
            { id: 'outdoor_dining', name: 'Outdoor Dining Area', icon: 'https://goblbs.com/wp-content/uploads/2024/11/OUTDOOR-DINING.png' },
            { id: 'outdoor_shower', name: 'Outdoor Shower', icon: 'https://goblbs.com/wp-content/uploads/2024/11/OUTDOOR-SHOWER.png' },
            { id: 'backyard', name: 'Enclosed Backyard', icon: 'https://goblbs.com/wp-content/uploads/2024/11/BACKYARD.png' },
            { id: 'lake', name: 'Lake Access', icon: 'https://goblbs.com/wp-content/uploads/2024/11/LAKE.png' },
            { id: 'beach', name: 'Beach Access', icon: 'https://goblbs.com/wp-content/uploads/2024/11/BEACH.png' },
            { id: 'ski', name: 'Ski in/Ski out', icon: 'https://goblbs.com/wp-content/uploads/2024/11/SKIING.png' },
            { id: 'parking', name: 'Parking space', icon: 'https://goblbs.com/wp-content/uploads/2024/11/PARKING.png' }
        ]
    },
    entertainment: {
        title: 'Entertainment',
        items: [
            { id: 'wifi', name: 'Wifi', icon: 'https://goblbs.com/wp-content/uploads/2024/11/wifi-icon.png' },
            { id: 'tv', name: 'TV', icon: 'https://goblbs.com/wp-content/uploads/2024/11/TV.png' },
            { id: 'pool_table', name: 'Pool Table', icon: 'https://goblbs.com/wp-content/uploads/2024/11/POOL-TABLE.png' },
            { id: 'firepit', name: 'Fire Pit', icon: 'https://goblbs.com/wp-content/uploads/2024/11/FIREPIT.png' },
            { id: 'pool', name: 'Pool', icon: 'https://goblbs.com/wp-content/uploads/2024/11/POOL1.png' },
            { id: 'hottub', name: 'Hot Tub', icon: 'https://goblbs.com/wp-content/uploads/2024/11/HOTTUB1.png' },
            { id: 'piano', name: 'Piano', icon: 'https://goblbs.com/wp-content/uploads/2024/11/PIANO.png' },
            { id: 'gym', name: 'Exercise Equipment', icon: 'https://goblbs.com/wp-content/uploads/2024/11/GYM.png' }
        ]
    },
    household: {
        title: 'Household',
        items: [
            { id: 'iron', name: 'Iron & Board', icon: 'https://goblbs.com/wp-content/uploads/2024/11/IRON.png' },
            { id: 'soaps', name: 'Soaps', icon: 'https://goblbs.com/wp-content/uploads/2024/11/SOAP.png' },
            { id: 'linens', name: 'Linens', icon: 'https://goblbs.com/wp-content/uploads/2024/11/LINENS.png' },
            { id: 'toilet_paper', name: 'Toilet Paper', icon: 'https://goblbs.com/wp-content/uploads/2024/11/TOILETPAPER.png' },
            { id: 'towels', name: 'Towels', icon: 'https://goblbs.com/wp-content/uploads/2024/11/TOWEL.png' },
            { id: 'hairdryer', name: 'Hair Dryer', icon: 'https://goblbs.com/wp-content/uploads/2024/11/Hair-Dryer.png' },
            { id: 'coffee', name: 'Coffee Machine', icon: 'https://goblbs.com/wp-content/uploads/2024/11/COFFEE.png' }
        ]
    },
    safety: {
        title: 'Safety',
        items: [
            { id: 'smoke_alarm', name: 'Smoke Alarm', icon: 'https://goblbs.com/wp-content/uploads/2024/11/SMOKE-ALARM.png' },
            { id: 'first_aid', name: 'First Aid Kit', icon: 'https://goblbs.com/wp-content/uploads/2024/11/FIRST-AID.png' },
            { id: 'fire_extinguisher', name: 'Fire Extinguisher', icon: 'https://goblbs.com/wp-content/uploads/2024/11/FIRE-EXTINGUISHER-1.png' },
            { id: 'co_detector', name: 'Carbon Monoxide Detector', icon: 'https://goblbs.com/wp-content/uploads/2024/11/CMD.png' },
            { id: 'alarm', name: 'Home Alarm', icon: 'https://goblbs.com/wp-content/uploads/2024/11/ALARM.png' }
        ]
    }
};

        useEffect(() => {
            if (step === 'location' || step === 'pricing') {
                initializeMap();
              }
        }, [step]);

        const initializeMap = () => {
            const defaultLocation = { lat: 37.0902, lng: -95.7129 };
            const mapElement = document.getElementById('map');
            
            if (mapElement) {
                const map = new google.maps.Map(mapElement, {
                    center: defaultLocation,
                    zoom: 4,
                    styles: [
                        {
                            featureType: "poi",
                            elementType: "labels",
                            stylers: [{ visibility: "off" }]
                        }
                    ]
                });
                mapRef.current = map;

                const marker = new google.maps.Marker({
                    map: map,
                    visible: false
                });
                markerRef.current = marker;

                const input = document.getElementById('address-input');
                const autocomplete = new google.maps.places.Autocomplete(input);
                autocomplete.bindTo('bounds', map);
                autocompleteRef.current = autocomplete;

                autocomplete.addListener('place_changed', () => {
                    const place = autocomplete.getPlace();
                    if (!place.geometry) {
                        return;
                    }

                    if (place.geometry.viewport) {
                        map.fitBounds(place.geometry.viewport);
                    } else {
                        map.setCenter(place.geometry.location);
                        map.setZoom(17);
                    }

                    marker.setPosition(place.geometry.location);
                    marker.setVisible(true);

                    setLocation(place);
                    setAddress(place.formatted_address);
                });
            }
        };

        const handlePropertySelect = (type) => {
            setFadeOut(true);
            setTimeout(() => {
                setStep('privacy-type');
                setProgress(20);
                setFadeOut(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 500);
        };

        const handleSpaceTypeSelect = (type) => {
            setFadeOut(true);
            setTimeout(() => {
                setStep('location');
                setProgress(40);
                setFadeOut(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 500);
        };

        const handleBack = () => {
    setFadeOut(true);
    setTimeout(() => {
        if (step === 'privacy-type') {
            setStep('structure');
            setProgress(0);
        } else if (step === 'location') {
            setStep('privacy-type');
            setProgress(20);
        } else if (step === 'property-info') {
            setStep('location');
            setProgress(40);
        } else if (step === 'amenities') {
            setStep('property-info');
            setProgress(60);
        } else if (step === 'rooms') {
            setStep('amenities');
            setProgress(60);
        } else if (step === 'photos') {
            setStep('rooms');
            setProgress(80);
        } else if (step === 'headline') {
            setStep('photos');
            setProgress(90);
        } else if (step === 'description') {
             setStep('headline');
              setProgress(95);
        } else if (step === 'pricing') {
             setStep('description');
             setProgress(98);
        } else if (step === 'house-rules') {
             setStep('pricing');
             setProgress(99);
        }
        setFadeOut(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 500);
};

        const handleLocationContinue = () => {
    if (location) {
        setFadeOut(true);
        setTimeout(() => {
            setStep('property-info');
            setProgress(60);
            setFadeOut(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 500);
    }
};

const handleAmenitiesContinue = () => {
    setFadeOut(true);
    setTimeout(() => {
        setStep('rooms');
        setProgress(80);
        setFadeOut(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });

        if (rooms.length === 0) {
            // Initialize bedrooms
            const bedroomsList = Array(bedrooms).fill().map((_, index) => ({
                id: Date.now() + index,
                type: 'bedroom',
                name: `Bedroom ${index + 1}`,
                beds: [{ type: bedTypes.queen, quantity: 1 }]
            }));
            
            // Initialize bathrooms
            const bathroomCount = Math.ceil(bathrooms);
            const bathroomsList = Array(bathroomCount).fill().map((_, index) => ({
                id: Date.now() + bedrooms + index,
                type: 'bathroom',
                name: bathrooms % 1 === 0 ? 
                    `Bathroom ${index + 1}` : 
                    `${index + 1 === bathroomCount ? 'Half' : 'Full'} Bathroom`,
                beds: []
            }));

            setRooms([...bedroomsList, ...bathroomsList]);
        }
    }, 500);
};

const handleAmenityToggle = (amenityId) => {
    setSelectedAmenities(prev => {
        const newSet = new Set(prev);
        if (newSet.has(amenityId)) {
            newSet.delete(amenityId);
        } else {
            newSet.add(amenityId);
        }
        return newSet;
    });
};

// Define modals
const deleteModal = showDeleteModal && wp.element.createElement(
    'div',
    { className: 'modal-overlay' },
    wp.element.createElement('div', { className: 'modal-content' }, [
    wp.element.createElement('button', {
        key: 'close',
        className: 'modal-close',
        onClick: () => setShowDeleteModal(false)
    }, '×'),
        wp.element.createElement('h3', { key: 'title', className: 'modal-title' },
            'Are you sure you want to delete this room?'),
        wp.element.createElement('div', { className: 'modal-footer' }, [
            wp.element.createElement('div', { key: 'buttons', className: 'button-group' }, [
                wp.element.createElement('button', {
                    key: 'cancel',
                    className: 'button-cancel',
                    onClick: () => {
                        setShowDeleteModal(false);
                        setShowEditModal(true); // Return to edit modal
                    }
                }, 'Cancel'),
                wp.element.createElement('button', {
                    key: 'continue',
                    className: 'button-confirm',
                    onClick: () => {
                        handleRoomDelete();
                        setShowDeleteModal(false);
                    }
                }, 'Continue')
            ])
        ])
    ])
);

const editModal = showEditModal && wp.element.createElement(
    'div',
    { className: 'modal-overlay' },
    wp.element.createElement('div', { className: 'modal-content' }, [
    wp.element.createElement('button', {
        key: 'close',
        className: 'modal-close',
        onClick: () => {
            setShowEditModal(false);
            setEditingRoom(null);
        }
    }, '×'),
        wp.element.createElement('div', { key: 'room-form', className: 'room-form' }, [
            wp.element.createElement('input', {
                key: 'name',
                className: 'form-input',
                type: 'text',
                placeholder: 'Room name',
                value: editingRoom?.name || '',
                onChange: (e) => setEditingRoom({
                    ...editingRoom,
                    name: e.target.value
                })
            }),
            (editingRoom?.type === 'bathroom' ? editingRoom?.amenities : editingRoom?.beds)?.map((item, index) => wp.element.createElement('div', {
    key: `${editingRoom.type}-${index}`,
    className: 'bed-row'
}, [
    wp.element.createElement('select', {
        key: 'type',
        className: 'form-select',
        value: item.type.name,
        onChange: (e) => {
            const newItems = [...(editingRoom.type === 'bathroom' ? editingRoom.amenities : editingRoom.beds)];
            newItems[index].type = Object.values(editingRoom.type === 'bathroom' ? bathroomTypes : bedTypes)
                .find(type => type.name === e.target.value);
            setEditingRoom({ 
                ...editingRoom, 
                [editingRoom.type === 'bathroom' ? 'amenities' : 'beds']: newItems 
            });
        }
    }, Object.values(editingRoom.type === 'bathroom' ? bathroomTypes : bedTypes).map(type => 
        wp.element.createElement('option', {
            key: type.name,
            value: type.name
        }, type.name)
    )),
                wp.element.createElement(Counter, {
    key: 'quantity',
    value: item.quantity,
    onChange: (newValue) => {
        const newItems = [...(editingRoom.type === 'bathroom' ? editingRoom.amenities : editingRoom.beds)];
        newItems[index].quantity = newValue;
        setEditingRoom({ 
            ...editingRoom, 
            [editingRoom.type === 'bathroom' ? 'amenities' : 'beds']: newItems 
        });
    },
    min: 1,
    max: 10,
    label: 'Qty'
}),
                (editingRoom.type === 'bathroom' ? editingRoom.amenities : editingRoom.beds).length > 1 && wp.element.createElement('img', {
    key: 'delete',
    className: 'delete-bed-icon',
    src: 'https://goblbs.com/wp-content/uploads/2024/11/GARBAGE.png',
    onClick: () => {
        if (editingRoom.type === 'bathroom') {
            const newAmenities = editingRoom.amenities.filter((_, i) => i !== index);
            setEditingRoom({ ...editingRoom, amenities: newAmenities });
        } else {
            const newBeds = editingRoom.beds.filter((_, i) => i !== index);
            setEditingRoom({ ...editingRoom, beds: newBeds });
        }
    }
})
            ])),
            wp.element.createElement('button', {
    key: 'add-item',
    className: 'add-bed-link',
    onClick: () => {
        if (editingRoom.type === 'bathroom') {
            setEditingRoom({
                ...editingRoom,
                amenities: [...(editingRoom.amenities || []), { type: bathroomTypes.bathtub, quantity: 1 }]
            });
        } else {
            setEditingRoom({
                ...editingRoom,
                beds: [...(editingRoom.beds || []), { type: bedTypes.queen, quantity: 1 }]
            });
        }
    }
}, editingRoom.type === 'bathroom' ? '+ Add bathroom amenity' : '+ Add another bed')
        ]),
        wp.element.createElement('div', { className: 'modal-footer' }, [
            wp.element.createElement('div', { key: 'buttons', className: 'button-group' }, [
                wp.element.createElement('button', {
    key: 'cancel',
    className: 'button-cancel',
    onClick: () => {
        setShowCancelModal(true);
    }
}, 'Cancel'),
                wp.element.createElement('button', {
                    key: 'save',
                    className: 'button-confirm',
                    onClick: () => handleRoomSave(editingRoom),
                    disabled: !editingRoom?.name
                }, 'Save')
            ]),
            wp.element.createElement('button', {
                key: 'delete-room',
                className: 'delete-room-button',
                onClick: () => {
                    setDeleteRoomId(editingRoom.id);
                    setShowEditModal(false);
                    setShowDeleteModal(true);
                }
            }, 'Delete room')
        ])
    ])
);
const cancelModal = showCancelModal && wp.element.createElement(
    'div',
    { className: 'modal-overlay' },
    wp.element.createElement('div', { className: 'modal-content' }, [
    wp.element.createElement('button', {
        key: 'close',
        className: 'modal-close',
        onClick: () => setShowCancelModal(false)
    }, '×'),
        wp.element.createElement('h3', { key: 'title', className: 'modal-title' },
            'Are you sure you want to cancel?'),
        wp.element.createElement('p', { key: 'subtitle' },
            'Your changes will not be saved'),
        wp.element.createElement('div', { key: 'buttons', className: 'button-group' }, [
            wp.element.createElement('button', {
                key: 'cancel',
                className: 'button-cancel',
                onClick: () => setShowCancelModal(false)
            }, 'Cancel'),
            wp.element.createElement('button', {
                key: 'leave',
                className: 'button-confirm',
                onClick: () => {
                    setShowCancelModal(false);
                    setShowEditModal(false);
                    setEditingRoom(null);
                }
            }, 'Leave')
        ])
    ])
);

return wp.element.createElement('div', 
    { className: `step-content ${fadeOut ? 'fade-out' : ''}` },
    [
        wp.element.createElement('h2', { key: 'title' },
    step === 'structure' ? 'What will you host?' : 
    step === 'privacy-type' ? 'What type of space will guests have?' :
    step === 'location' ? 'Rental Location' :
    step === 'property-info' ? 'Property Information' :
    step === 'amenities' ? 'Attract renters with Amenities' :
    step === 'rooms' ? 'Rooms and sleep spaces' :
    step === 'photos' ? 'Upload your photos' :
    step === 'headline' ? 'Time to create a title for your home!' :
    step === 'description' ? 'Description' : 
    step === 'pricing' ? 'Name your price' :
    step === 'house-rules' ? 'House Rules' : ''
),

        // Photos section
        step === 'photos' && wp.element.createElement(
            'div',
            { key: 'photos-container', className: 'photos-container' },
            [
                wp.element.createElement('p', { key: 'subtitle', className: 'photos-subtitle' },
                    "You'll need a minimum of 5 photos to begin. Don't worry—you can add more or update them later."),
                wp.element.createElement('p', { key: 'description', className: 'photos-description' },
                    "Show travelers where they'll dine, rest, and relax. Be sure to highlight unique features, outdoor areas, and any nearby attractions."),
                wp.element.createElement('div', { 
                    key: 'upload-box',
                    className: 'upload-box',
                    onDragOver: (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    },
                    onDrop: (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const files = Array.from(e.dataTransfer.files);
                        handlePhotos(files);
                    }
                }, [
                    wp.element.createElement('img', {
                        key: 'camera-icon',
                        src: 'https://goblbs.com/wp-content/uploads/2024/11/CAMERA.png',
                        alt: 'Upload',
                        className: 'upload-icon'
                    }),
                    wp.element.createElement('p', { key: 'drag-text' }, 
                        'Drag and drop your photos here'),
                    wp.element.createElement('p', { key: 'or-text' }, 'or'),
                    wp.element.createElement('input', {
                        key: 'file-input',
                        type: 'file',
                        multiple: true,
                        accept: 'image/*',
                        style: { display: 'none' },
                        id: 'photo-upload',
                        onChange: (e) => handlePhotos(e.target.files)
                    }),
                    wp.element.createElement('label', {
                        key: 'upload-button',
                        htmlFor: 'photo-upload',
                        className: 'upload-button'
                    }, 'Upload')
                ]),
                wp.element.createElement('p', {
                    key: 'reorder-instruction',
                    style: {
                        color: '#387780',
                        textAlign: 'center',
                        margin: '1rem 0',
                        fontSize: '0.9rem'
                    }
                }, 'Drag and drop to re-order your photos. This will be the order in which they show on your listing.'),
                [
    photos.length > 0 && wp.element.createElement('div', { key: 'grid', className: 'photos-grid' },
        photos.map((photo, index) => wp.element.createElement('div', {
            key: photo.id,
            className: 'photo-item',
            draggable: true,
            onDragStart: (e) => {
                e.dataTransfer.setData('text/plain', index.toString());
                e.currentTarget.classList.add('dragging');
            },
            onDragEnd: (e) => e.currentTarget.classList.remove('dragging'),
            onDragOver: (e) => {
                e.preventDefault();
                e.currentTarget.classList.add('drag-over');
            },
            onDragLeave: (e) => e.currentTarget.classList.remove('drag-over'),
            onDrop: (e) => {
                e.preventDefault();
                e.currentTarget.classList.remove('drag-over');
                const startIndex = parseInt(e.dataTransfer.getData('text/plain'));
                const endIndex = index;
                reorderPhotos(startIndex, endIndex);
            }
        }, [
            wp.element.createElement('img', {
                key: 'photo',
                src: photo.url,
                alt: 'Property photo'
            }),
            index === 0 && wp.element.createElement('span', {
                key: 'cover',
                className: 'cover-photo-label'
            }, 'Cover Photo'),
            wp.element.createElement('button', {
                key: 'remove',
                className: 'remove-photo',
                onClick: () => removePhoto(photo.id)
            }, '×')
        ]))
    ),
    wp.element.createElement('div', {
        key: 'validation',
        style: {
            color: '#ff4444',
            marginTop: '10px',
            textAlign: 'left',
            opacity: photos.length < 5 ? 1 : 0,
            transition: 'opacity 0.3s ease'
        }
    }, '5 photos minimum'),
    wp.element.createElement('button', {
        key: 'continue',
        className: 'continue-button',
        style: { marginTop: '20px' },
        disabled: photos.length < 5,
        onClick: () => {
            setFadeOut(true);
            setTimeout(() => {
                setStep('headline');
                setProgress(95);
                setFadeOut(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 500);
        }
    }, 'Continue')
]
        ]),  // Close photos container

        step === 'headline' && wp.element.createElement('div',
            { key: 'headline-container', className: 'headline-container' },
            [
                wp.element.createElement('p', { key: 'subtitle', className: 'headline-subtitle' },
                    "Keep it short and catchy—you can always update it later. This will appear in searches and as the headline of your listing."),
                wp.element.createElement('div', { key: 'input-container', className: 'headline-input-container' }, [
    wp.element.createElement('input', {
        key: 'title-input',
        type: 'text',
        className: 'headline-input',
        value: title,
        maxLength: 56,
        onChange: (e) => setTitle(e.target.value),
        placeholder: 'Enter your title'
    }),
    wp.element.createElement('div', { 
    key: 'validation-container',
    className: 'validation-container',
    style: { 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        width: '100%', 
        marginTop: '8px'
    }
}, [
    title.length < 7 && wp.element.createElement('span', {
        key: 'min-chars',
        style: { 
            color: '#ff4444',
            fontSize: '0.9rem'
        }
    }, '7 characters minimum'),
    wp.element.createElement('span', { 
        key: 'char-counter',
        style: {
            fontSize: '0.9rem',
            color: title.length < 7 || title.length > 56 ? '#ff4444' : '#666'
        }
    }, `${title.length}/56`)
])
]),
wp.element.createElement('button', {
    key: 'continue-next',
    className: 'continue-button',
    style: { marginTop: '20px' },
    disabled: title.length < 7 || title.length > 56,
    onClick: () => {
        setFadeOut(true);
        setTimeout(() => {
            setStep('description');
            setProgress(98);
            setFadeOut(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 500);
    }
}, 'Continue')
]),  // Close headline container

// Description section
step === 'description' && wp.element.createElement(
    'div',
    { key: 'description-container', className: 'headline-container' },
    [
        wp.element.createElement('p', { key: 'subtitle', className: 'headline-subtitle' },
            "Craft a description that highlights what makes your property unique and helps guests envision their stay."),
        wp.element.createElement('div', { key: 'input-container', className: 'headline-input-container' }, [
            wp.element.createElement('textarea', {
                key: 'description-input',
                className: 'headline-input description-input',
                value: description,
                maxLength: 5000,
                onChange: (e) => setDescription(e.target.value),
                placeholder: 'Enter your description'
            }),
            wp.element.createElement('div', { 
                key: 'validation-container',
                className: 'validation-container',
                style: { 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    width: '100%', 
                    marginTop: '8px'
                }
            }, [
                description.length < 100 && wp.element.createElement('span', {
                    key: 'min-chars',
                    style: { 
                        color: '#ff4444',
                        fontSize: '0.9rem'
                    }
                }, '100 characters minimum'),
                wp.element.createElement('span', { 
                    key: 'char-counter',
                    style: {
                        fontSize: '0.9rem',
                        color: description.length < 100 || description.length > 5000 ? '#ff4444' : '#666'
                    }
                }, `${description.length}/5000`)
            ]),
            wp.element.createElement('button', {
                key: 'continue-next',
                className: 'continue-button',
                style: { marginTop: '20px' },
                disabled: description.length < 100 || description.length > 5000,
                onClick: () => {
                   setFadeOut(true);
                   setTimeout(() => {
                        setStep('pricing');
                        setProgress(99);
                        setFadeOut(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }, 500);
                }
            }, 'Continue')
        ])
    ]
),

// Pricing section
step === 'pricing' && wp.element.createElement(
    'div',
    { key: 'pricing-container', className: 'pricing-container' },
    [
        wp.element.createElement('p', { key: 'subtitle', className: 'pricing-subtitle' },
            "Set your nightly price and adjust it anytime. For guidance, check similar listings in your area by clicking the map icon below. Your price should reflect your location, amenities, and nearby attractions. For more information click the More Info button below."),
        
        wp.element.createElement('div', { 
    key: 'price-input-wrapper',
    className: 'price-input-wrapper'
}, [
    wp.element.createElement('div', {
        key: 'price-display',
        className: 'price-display'
    }, [
        wp.element.createElement('span', { 
            key: 'currency',
            className: 'currency-symbol'
        }, '$'),
        wp.element.createElement('input', {
    key: 'price-input',
    type: 'text',
    className: 'price-input',
    value: price === '0' ? '0' : formatNumberWithCommas(price),
    onChange: (e) => {
        const newValue = e.target.value.replace(/[^\d]/g, '');
        if (newValue) {
            // Remove leading zeros
            const cleanValue = newValue.replace(/^0+/, '');
            if (parseInt(cleanValue) <= 999999) {
                setPrice(cleanValue);
            }
        } else {
            setPrice('0');
        }
    },
    onFocus: (e) => {
        if (price === '0') {
            setPrice('');
        }
    },
    onBlur: (e) => {
        if (!price || price === '') {
            setPrice('0');
        }
    },
    style: { 
        width: `${(price && price !== '0' ? price.length : 1) * 1.5}ch`,
        minWidth: '1ch',
        fontSize: `${Math.max(7.5 - (price.length * 0.2), 4)}rem`,
        backgroundColor: 'transparent',
        border: 'none',
        boxShadow: 'none',
        color: '#0ce820',
        textAlign: 'center',
        padding: 0,
        display: 'inline-block'
    }
})
    ])
]),

        parseFloat(price) > 15000 && wp.element.createElement('p', {
            key: 'price-error',
            className: 'price-error'
        }, 'Please set a price within the range of $1 to $15,000'),

        price && parseFloat(price) > 0 && parseFloat(price) <= 15000 && wp.element.createElement('div', {
            key: 'calculations',
            className: 'calculations-container'
        }, [
            // Guest Service Fee Row
            wp.element.createElement('div', { 
                key: 'service-fee',
                className: 'calculation-row'
            }, [
                wp.element.createElement('div', {
    key: 'service-fee-label',
    className: 'fee-label'
}, [
    wp.element.createElement('img', {
        src: 'https://goblbs.com/wp-content/uploads/2024/12/INFO.png',
        className: 'info-icon',
        onClick: () => setShowServiceFeeInfo(true)
    }),
    wp.element.createElement('span', null, 'Guest Service Fee')
]),
                wp.element.createElement('span', null, 
                    `$${(parseFloat(price) * 0.175).toFixed(2)}`)
            ]),

            // Guest Total Row
            wp.element.createElement('div', {
                key: 'total',
                className: 'calculation-row'
            }, [
                wp.element.createElement('div', {
                    key: 'total-label',
                    className: 'fee-label'
                }, [
                    wp.element.createElement('span', null, 'Guest total before taxes:'),
                    wp.element.createElement('img', {
                        src: 'https://goblbs.com/wp-content/uploads/2024/12/INFO.png',
                        className: 'info-icon',
                        onClick: () => setShowTotalInfo(true)
                    })
                ]),
                wp.element.createElement('span', null,
                    `$${(parseFloat(price) * 1.175).toFixed(2)}`)
            ]),

            // Your Earnings Row
            wp.element.createElement('div', {
                key: 'earnings',
                className: 'calculation-row'
            }, [
                wp.element.createElement('div', {
                    key: 'earnings-label',
                    className: 'fee-label'
                }, [
                    wp.element.createElement('span', null, 'Your Earnings'),
                    wp.element.createElement('img', {
                        src: 'https://goblbs.com/wp-content/uploads/2024/12/INFO.png',
                        className: 'info-icon',
                        onClick: () => setShowEarningsInfo(true)
                    })
                ]),
                wp.element.createElement('span', null,
                    `$${Math.ceil(parseFloat(price) * 0.952)}`)
            ])
        ]),

        // Map Button and Continue Button Section
wp.element.createElement('div', { key: 'pricing-section' }, [
    wp.element.createElement('button', {
        key: 'map-button',
        className: 'map-check-button',
        onClick: () => {
            if (!mapRef.current || !location) {
                console.log('Map or location not available');
                return;
            }
            
            const currentLocation = location.geometry.location;
            const mapContainer = document.createElement('div');
            mapContainer.style.position = 'fixed';
            mapContainer.style.top = '0';
            mapContainer.style.left = '0';
            mapContainer.style.width = '100%';
            mapContainer.style.height = '100%';
            mapContainer.style.backgroundColor = 'rgba(0,0,0,0.5)';
            mapContainer.style.zIndex = '1000';
            document.body.appendChild(mapContainer);

            const mapDiv = document.createElement('div');
            mapDiv.style.position = 'fixed';
            mapDiv.style.top = '10%';
            mapDiv.style.left = '10%';
            mapDiv.style.width = '80%';
            mapDiv.style.height = '80%';
            mapContainer.appendChild(mapDiv);

            const map = new google.maps.Map(mapDiv, {
                center: currentLocation,
                zoom: 11
            });

            const marker = new google.maps.Marker({
                position: currentLocation,
                map: map,
                icon: {
                    path: "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
                    fillColor: '#387780',
                    fillOpacity: 1,
                    strokeWeight: 0,
                    scale: 2,
                    anchor: new google.maps.Point(12, 24)
                }
            });

            const closeButton = document.createElement('button');
            closeButton.innerHTML = '×';
            closeButton.style.position = 'fixed';
            closeButton.style.top = 'calc(10% + 10px)';
            closeButton.style.right = 'calc(10% + 10px)';
            closeButton.style.zIndex = '1001';
            closeButton.style.background = '#387780';
            closeButton.style.color = 'white';
            closeButton.style.border = 'none';
            closeButton.style.borderRadius = '50%';
            closeButton.style.width = '32px';
            closeButton.style.height = '32px';
            closeButton.style.cursor = 'pointer';
            closeButton.style.display = 'flex';
            closeButton.style.alignItems = 'center';
            closeButton.style.justifyContent = 'center';
            closeButton.style.fontSize = '24px';

            closeButton.onclick = () => {
                document.body.removeChild(mapContainer);
            };
            mapContainer.appendChild(closeButton);
        }
    }, [
        wp.element.createElement('img', {
            key: 'map-icon',
            src: 'https://goblbs.com/wp-content/uploads/2024/12/MAP.png',
            alt: 'Map'
        }),
        'Check nearby listings'
    ]),

    // New kid discount
    wp.element.createElement('div', {
        key: 'new-kid-discount',
        className: 'calculation-row',
        style: { marginTop: '2rem' }
    }, [
        wp.element.createElement('div', { className: 'fee-label' }, [
            wp.element.createElement('span', null, 'New kid on the block discount'),
            wp.element.createElement('img', {
                src: 'https://goblbs.com/wp-content/uploads/2024/12/INFO.png',
                className: 'info-icon',
                onClick: () => setShowNewKidInfo(true)
            })
        ]),
        wp.element.createElement('input', {
            type: 'checkbox',
            className: 'discount-checkbox',
            onChange: (e) => setNewKidDiscount(e.target.checked)
        })
    ]),
    
    // Week discount
    wp.element.createElement('div', {
        key: 'week-discount',
        className: 'calculation-row'
    }, [
        wp.element.createElement('div', { className: 'fee-label' }, [
            wp.element.createElement('span', null, 'Its been one week discount'),
            wp.element.createElement('img', {
                src: 'https://goblbs.com/wp-content/uploads/2024/12/INFO.png',
                className: 'info-icon',
                onClick: () => setShowWeekInfo(true)
            })
        ]),
        wp.element.createElement('input', {
            type: 'checkbox',
            className: 'discount-checkbox',
            onChange: (e) => setWeekDiscount(e.target.checked)
        })
    ]),
    
    // Month discount
    wp.element.createElement('div', {
        key: 'month-discount',
        className: 'calculation-row'
    }, [
        wp.element.createElement('div', { className: 'fee-label' }, [
            wp.element.createElement('span', null, 'A day turns to a month discount'),
            wp.element.createElement('img', {
                src: 'https://goblbs.com/wp-content/uploads/2024/12/INFO.png',
                className: 'info-icon',
                onClick: () => setShowMonthInfo(true)
            })
        ]),
        wp.element.createElement('input', {
            type: 'checkbox',
            className: 'discount-checkbox',
            onChange: (e) => setMonthDiscount(e.target.checked)
        })
    ]),

    // Info Modals
    showNewKidInfo && wp.element.createElement('div', {
        className: 'info-modal-overlay',
        onClick: () => setShowNewKidInfo(false)
    }, [
        wp.element.createElement('div', {
            className: 'info-modal',
            onClick: e => e.stopPropagation()
        }, [
            wp.element.createElement('button', {
                className: 'modal-close',
                onClick: () => setShowNewKidInfo(false)
            }, '×'),
            wp.element.createElement('p', null,
                "Add a 20% discount for your listing as a new listing promotion. This increases your visibility when travelers search for places. The discount is valid for either the first three bookings or 90 days, whichever occurs first.")
        ])
    ]),
    
    showWeekInfo && wp.element.createElement('div', {
        className: 'info-modal-overlay',
        onClick: () => setShowWeekInfo(false)
    }, [
        wp.element.createElement('div', {
            className: 'info-modal',
            onClick: e => e.stopPropagation()
        }, [
            wp.element.createElement('button', {
                className: 'modal-close',
                onClick: () => setShowWeekInfo(false)
            }, '×'),
            wp.element.createElement('p', null,
                "Offer a saving for stays of 7 nights or more")
        ])
    ]),
    
    showMonthInfo && wp.element.createElement('div', {
        className: 'info-modal-overlay',
        onClick: () => setShowMonthInfo(false)
    }, [
        wp.element.createElement('div', {
            className: 'info-modal',
            onClick: e => e.stopPropagation()
        }, [
            wp.element.createElement('button', {
                className: 'modal-close',
                onClick: () => setShowMonthInfo(false)
            }, '×'),
            wp.element.createElement('p', null,
                "Offer a saving for stays of 28 nights or more")
        ])
    ]),

    // Continue Button for pricing page
    wp.element.createElement('button', {
        key: 'continue-to-rules',
        className: 'continue-button',
        style: { marginTop: '2rem' },
        disabled: !price || parseFloat(price) <= 0 || parseFloat(price) > 15000,
        onClick: () => {
            setFadeOut(true);
            setTimeout(() => {
                setStep('house-rules');
                setProgress(99);
                setFadeOut(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 500);
        }
    }, 'Continue')
]), // Close pricing container array

        // Info Modals
        showServiceFeeInfo && wp.element.createElement('div', {
            className: 'info-modal-overlay',
            onClick: () => setShowServiceFeeInfo(false)
        }, [
            wp.element.createElement('div', {
                className: 'info-modal',
                onClick: e => e.stopPropagation()
            }, [
                wp.element.createElement('button', {
                    className: 'modal-close',
                    onClick: () => setShowServiceFeeInfo(false)
                }, '×'),
                wp.element.createElement('p', null,
                    "The guest service fee is typically 17.5% of the nightly rate before taxes, though it may vary depending on several factors and the details of the booking. For stays of 28 nights or longer, the guest service fee may be reduced. When a guest pays in a currency different from the host's listing currency, the fee is adjusted to reflect the value we deliver to our guests.")
            ])
        ]),

        showTotalInfo && wp.element.createElement('div', {
            className: 'info-modal-overlay',
            onClick: () => setShowTotalInfo(false)
        }, [
            wp.element.createElement('div', {
                className: 'info-modal',
                onClick: e => e.stopPropagation()
            }, [
                wp.element.createElement('button', {
                    className: 'modal-close',
                    onClick: () => setShowTotalInfo(false)
                }, '×'),
                wp.element.createElement('div', { className: 'price-breakdown' }, [
                    wp.element.createElement('div', { className: 'breakdown-row' }, [
                        wp.element.createElement('span', null, 'Nightly Rate'),
                        wp.element.createElement('span', null, `$${parseFloat(price)}`)
                    ]),
                    wp.element.createElement('div', { className: 'breakdown-row' }, [
                        wp.element.createElement('span', null, 'Guest service fee'),
                        wp.element.createElement('span', null, `$${(parseFloat(price) * 0.175).toFixed(2)}`)
                    ])
                ])
            ])
        ]),

        showEarningsInfo && wp.element.createElement('div', {
            className: 'info-modal-overlay',
            onClick: () => setShowEarningsInfo(false)
        }, [
            wp.element.createElement('div', {
                className: 'info-modal',
                onClick: e => e.stopPropagation()
            }, [
                wp.element.createElement('button', {
                    className: 'modal-close',
                    onClick: () => setShowEarningsInfo(false)
                }, '×'),
                wp.element.createElement('div', { className: 'price-breakdown' }, [
                    wp.element.createElement('div', { className: 'breakdown-row' }, [
                        wp.element.createElement('span', null, 'Nightly rate'),
                        wp.element.createElement('span', null, `$${parseFloat(price)}`)
                    ]),
                    wp.element.createElement('div', { className: 'breakdown-row' }, [
                        wp.element.createElement('span', null, 'Host service fee'),
                        wp.element.createElement('span', null, `-$${(parseFloat(price) * 0.048).toFixed(2)}`)
                    ])
            ])
        ])
    ]),  // Close pricing container array

        // Structure section
        step === 'structure' && wp.element.createElement(
            'div',
            { key: 'property-grid', className: 'options-grid' },
            propertyTypes.map(type => wp.element.createElement(
                'div',
                {
                    key: type.id,
                    className: 'option-card',
                    onClick: () => handlePropertySelect(type.name)
                },
                [
                    wp.element.createElement('img', { key: 'img', src: type.icon, alt: type.name }),
                    wp.element.createElement('span', { key: 'span' }, type.name)
                ]
            ))
        ),
        step === 'privacy-type' && wp.element.createElement(
            'div',
            { key: 'space-grid', className: 'options-grid space-type-grid' },
            spaceTypes.map(type => wp.element.createElement(
                'div',
                {
                    key: type.id,
                    className: 'option-card',
                    onClick: () => handleSpaceTypeSelect(type.name)
                },
                [
                    wp.element.createElement('img', { key: 'img', src: type.icon, alt: type.name }),
                    wp.element.createElement('span', { key: 'span' }, type.name)
                ]
            ))
        ),
        step === 'location' && wp.element.createElement(
            'div',
            { key: 'location-container', className: 'location-container' },
            [
                wp.element.createElement(
                    'div',
                    { key: 'map-input-container', className: 'map-input-container' },
                    wp.element.createElement('input', {
                        id: 'address-input',
                        className: 'map-input',
                        type: 'text',
                        placeholder: 'Enter your address',
                        value: address,
                        onChange: (e) => setAddress(e.target.value)
                    })
                ),
                wp.element.createElement('div', {
                    key: 'map',
                    id: 'map',
                    className: 'map-container'
                }),
                wp.element.createElement(
                    'p',
                    { key: 'disclaimer', className: 'location-disclaimer' },
                    'Your address will only be shared with your guest once the reservation is confirmed'
                ),
                wp.element.createElement(
                    'button',
                    {
                        key: 'continue',
                        className: 'continue-button',
                        onClick: handleLocationContinue,
                        disabled: !location
                    },
                    'Continue'
                )
            ]
        ),
        step === 'property-info' && wp.element.createElement(
            'div',
            { key: 'property-info', className: 'property-info-container' },
            [
                wp.element.createElement(Counter, {
                    key: 'guests',
                    value: guests,
                    onChange: setGuests,
                    min: 1,
                    max: 18,
                    label: 'Guests'
                }),
                wp.element.createElement(Counter, {
                    key: 'bathrooms',
                    value: bathrooms,
                    onChange: setBathrooms,
                    min: 0.5,
                    max: 30,
                    step: 0.5,
                    label: 'Bathrooms'
                }),
                wp.element.createElement(Counter, {
                    key: 'bedrooms',
                    value: bedrooms,
                    onChange: setBedrooms,
                    min: 1,
                    max: 30,
                    label: 'Bedrooms'
                }),
                wp.element.createElement(Counter, {
                    key: 'beds',
                    value: beds,
                    onChange: setBeds,
                    min: 1,
                    max: 50,
                    label: 'Beds'
                }),
                wp.element.createElement(
                    'button',
                    {
                        key: 'continue',
                        className: 'continue-button',
                        onClick: () => {
                            setFadeOut(true);
                            setTimeout(() => {
                                setStep('amenities');
                                setProgress(60);
                                setFadeOut(false);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }, 500);
                        }
                    },
                    'Continue'
                )
            ]
        ),
        step === 'amenities' && wp.element.createElement(
            'div',
            { key: 'amenities-container', className: 'amenities-container' },
            [
                wp.element.createElement('p', { key: 'subtitle', className: 'amenities-subtitle' }, 
                    'Does your place have any of these to offer?'),
                ...Object.entries(amenityGroups).map(([groupKey, group]) => 
                    wp.element.createElement('div', { key: groupKey, className: 'amenities-group' }, [
                        wp.element.createElement('h3', { key: 'title', className: 'amenities-group-title' }, 
                            group.title),
                        wp.element.createElement('div', { key: 'grid', className: 'amenities-grid' },
                            group.items.map(amenity => 
                                wp.element.createElement('div', {
                                    key: amenity.id,
                                    className: `amenity-card ${selectedAmenities.has(amenity.id) ? 'selected' : ''}`,
                                    onClick: () => handleAmenityToggle(amenity.id)
                                }, [
                                    wp.element.createElement('img', {
                                        key: 'img',
                                        src: amenity.icon,
                                        alt: amenity.name
                                    }),
                                    wp.element.createElement('span', { key: 'name' }, amenity.name)
                                ])
                            )
                        )
                    ])
                ),
                wp.element.createElement(
                    'button',
                    {
                        key: 'continue',
                        className: 'continue-button',
                        onClick: handleAmenitiesContinue
                    },
                    'Continue'
                )
            ]
        ),
        step === 'rooms' && wp.element.createElement(
            'div',
            { key: 'rooms-container', className: 'rooms-container' },
            [
                wp.element.createElement('p', { key: 'subtitle', className: 'rooms-subtitle' },
                    'Show renters where they will sleep, and what rooms are available to them.'),
                rooms.map((room) => wp.element.createElement(
    'div',
    { 
        key: room.id, 
        className: `room-box ${room.type === 'bathroom' ? 'bathroom-box' : ''}`
    },
    [
        wp.element.createElement('div', { key: 'header', className: 'room-box-header' },
    [
        wp.element.createElement('div', { key: 'title', className: 'room-box-title' }, room.name),
        room.type === 'bathroom' && room.amenities && room.amenities.map((amenity, index) => 
            wp.element.createElement('div', { 
                key: `amenity-${index}`, 
                className: 'bed-info'
            }, [
                wp.element.createElement('img', {
                    key: 'amenity-icon',
                    src: amenity.type.icon,
                    alt: amenity.type.name
                }),
                wp.element.createElement('span', { key: 'amenity-text' }, 
                    `${amenity.quantity} ${amenity.type.name}${amenity.quantity > 1 ? 's' : ''}`)
            ])
        ),
                room.type !== 'bathroom' && room.beds.map((bed, index) => 
                    wp.element.createElement('div', { 
                        key: `bed-${index}`, 
                        className: 'bed-info'
                    }, [
                        wp.element.createElement('img', {
                            key: 'bed-icon',
                            src: bed.type.icon,
                            alt: bed.type.name
                        }),
                        wp.element.createElement('span', { key: 'bed-text' }, 
                            `${bed.quantity} ${bed.type.name} Bed${bed.quantity > 1 ? 's' : ''}`)
                    ])
                )
            ]),
                        wp.element.createElement('div', { key: 'actions', className: 'room-box-actions' },
                            [
                                wp.element.createElement('button', {
                                    key: 'edit',
                                    className: 'edit-button',
                                    onClick: () => {
                                        setEditingRoom(room);
                                        setShowEditModal(true);
                                    }
                                }, 'Edit'),
                                wp.element.createElement('button', {
                                    key: 'delete',
                                    className: 'delete-button',
                                    onClick: () => {
                                        setDeleteRoomId(room.id);
                                        setShowDeleteModal(true);
                                    }
                                }, 'Delete')
                            ])
                    ])),
                wp.element.createElement('button', {
    key: 'add-room',
    className: 'add-space-button',
    onClick: () => setShowRoomTypeModal(true)
}, '+Add bedroom or bathroom'),
                wp.element.createElement('h3', { key: 'sleep-space-title' },
                    'Add another sleep space'),
                wp.element.createElement('p', { key: 'sleep-space-subtitle' },
                    'Add additional sleep spaces, such as a living room, or office that has a bed.'),
                wp.element.createElement('button', {
                    key: 'add-sleep-space',
                    className: 'add-space-button',
                    onClick: () => {
                        setEditingRoom({
                            id: Date.now(),
                            type: 'sleep_space',
                            name: 'New Sleep Space',
                            beds: [{ type: bedTypes.sofa, quantity: 1 }]
                        });
                        setShowEditModal(true);
                    }
                }, '+Add sleep space'),
                deleteModal,
                editModal,
                cancelModal,
                showRoomTypeModal && wp.element.createElement(
                    'div',
                    { className: 'modal-overlay' },
                    wp.element.createElement('div', { className: 'modal-content' }, [
    wp.element.createElement('button', {
        key: 'close',
        className: 'modal-close',
        onClick: () => setShowRoomTypeModal(false)
    }, '×'),
                        wp.element.createElement('h3', { key: 'title', className: 'modal-title' },
                            'Adding a Bedroom or Bathroom?'),
                        wp.element.createElement('div', { className: 'button-group' }, [
                            wp.element.createElement('button', {
                                key: 'bedroom',
                                className: 'button-confirm',
                                onClick: () => {
                                    setEditingRoom({
                                        id: Date.now(),
                                        type: 'bedroom',
                                        name: `Bedroom ${rooms.length + 1}`,
                                        beds: [{ type: bedTypes.queen, quantity: 1 }]
                                    });
                                    setShowRoomTypeModal(false);
                                    setShowEditModal(true);
                                }
                            }, 'Bedroom'),
                            wp.element.createElement('button', {
                                key: 'bathroom',
                                className: 'button-confirm',
                                onClick: () => {
                                    setEditingRoom({
                                        id: Date.now(),
                                        type: 'bathroom',
                                        name: `Bathroom ${rooms.length + 1}`,
                                        amenities: [{ type: bathroomTypes.bathtub, quantity: 1 }]
                                    });
                                    setShowRoomTypeModal(false);
                                    setShowEditModal(true);
                                }
                            }, 'Bathroom')
                        ])
                    ])
                ),
                showEditModal && editingRoom?.type === 'sleep_space' && wp.element.createElement(
    'div',
    { className: 'modal-overlay' },
    wp.element.createElement('div', { className: 'modal-content' }, [
        wp.element.createElement('button', {
            key: 'close',
            className: 'modal-close',
            onClick: () => {
                setShowEditModal(false);
                setEditingRoom(null);
                setSleepSpaceLocation('');
            }
        }, '×'),
        wp.element.createElement('h3', { key: 'title', className: 'modal-title' },
                            'Adding Sleep Space'),
                        wp.element.createElement('p', { key: 'subtitle', className: 'modal-subtitle' },
                            'Have shared spaces with beds or couches? Include them here. If you have more than one shared space with beds, please list each one individually.'),
                        wp.element.createElement('select', {
                            key: 'location',
                            className: 'form-select',
                            value: sleepSpaceLocation,
                            onChange: (e) => {
                                setSleepSpaceLocation(e.target.value);
                                setEditingRoom({
                                    ...editingRoom,
                                    name: e.target.value
                                });
                            }
                        }, [
                            wp.element.createElement('option', { value: '' }, 'Select Location'),
                            ...locations.map(loc => 
                                wp.element.createElement('option', { key: loc, value: loc }, loc)
                            )
                        ]),
                        editingRoom.beds.map((bed, index) => wp.element.createElement('div', {
                            key: `bed-${index}`,
                            className: 'bed-row'
                        }, [
                            wp.element.createElement('select', {
                                key: 'type',
                                className: 'form-select',
                                value: bed.type.name,
                                disabled: !sleepSpaceLocation,
                                onChange: (e) => {
                                    const newBeds = [...editingRoom.beds];
                                    newBeds[index].type = Object.values(bedTypes).find(type => type.name === e.target.value);
                                    setEditingRoom({ ...editingRoom, beds: newBeds });
                                }
                            }, [
                                wp.element.createElement('option', { value: '' }, 'Select Bed Type'),
                                ...Object.values(bedTypes).map(type => 
                                    wp.element.createElement('option', {
                                        key: type.name,
                                        value: type.name
                                    }, type.name)
                                )
                            ]),
                            wp.element.createElement(Counter, {
                                key: 'quantity',
                                value: bed.quantity,
                                onChange: (newValue) => {
                                    const newBeds = [...editingRoom.beds];
                                    newBeds[index].quantity = newValue;
                                    setEditingRoom({ ...editingRoom, beds: newBeds });
                                },
                                min: 1,
                                max: 10,
                                label: 'Qty'
                            }),
                            editingRoom.beds.length > 1 && wp.element.createElement('img', {
                                key: 'delete',
                                className: 'delete-bed-icon',
                                src: 'https://goblbs.com/wp-content/uploads/2024/11/GARBAGE.png',
                                onClick: () => {
                                    const newBeds = editingRoom.beds.filter((_, i) => i !== index);
                                    setEditingRoom({ ...editingRoom, beds: newBeds });
                                }
                            })
                        ])),
                        wp.element.createElement('button', {
                            key: 'add-bed',
                            className: 'add-bed-link',
                            disabled: !sleepSpaceLocation,
                            onClick: () => {
                                setEditingRoom({
                                    ...editingRoom,
                                    beds: [...editingRoom.beds, { type: bedTypes.queen, quantity: 1 }]
                                });
                            }
                        }, '+ Add another bed'),
                        wp.element.createElement('div', { className: 'modal-footer' }, [
                            wp.element.createElement('div', { key: 'buttons', className: 'button-group' }, [
                                wp.element.createElement('button', {
                                    key: 'cancel',
                                    className: 'button-cancel',
                                    onClick: () => {
                                        setShowCancelModal(true);
                                        setShowEditModal(false);
                                    }
                                }, 'Cancel'),
                                wp.element.createElement('button', {
                                    key: 'save',
                                    className: 'button-confirm',
                                    onClick: () => handleRoomSave(editingRoom),
                                    disabled: !editingRoom?.name || !sleepSpaceLocation
                                }, 'Save')
                            ])
                        ])
                    ])
                )
            ]
        ),
        (step === 'rooms' && wp.element.createElement('button', {
    key: 'continue-photos',
    className: 'continue-button',
    disabled: rooms.some(room => room.type === 'bathroom' && (!room.amenities || room.amenities.length === 0)),
    onClick: () => {
        setFadeOut(true);
        setTimeout(() => {
            setStep('photos');
            setProgress(90);
            setFadeOut(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 500);
    }
}, 'Continue')),
step !== 'structure' && wp.element.createElement(
            'button',
            {
                key: 'back-button',
                className: 'back-button',
                onClick: handleBack
            },
            'Back'
        ),
        wp.element.createElement('div', {
            key: 'progress-bar',
            className: 'progress-bar'
        }, wp.element.createElement('div', {
            className: 'progress',
            style: { width: `${progress}%` }
        })),

        // House Rules section
        step === 'house-rules' && wp.element.createElement(
            'div',
            { key: 'house-rules-container', className: 'house-rules-container' },
            [
                wp.element.createElement('p', { key: 'subtitle', className: 'rules-subtitle' },
                    "Create a set of guidelines for your property that guests must review and agree to before confirming their booking."),

                // Events Section
                wp.element.createElement('div', { key: 'events-section', className: 'rules-section' }, [
                    wp.element.createElement('h3', { className: 'rules-heading' }, 'Events'),
                    wp.element.createElement('div', { className: 'question-row' }, [
                        wp.element.createElement('span', null, 'Will you allow events?'),
                        wp.element.createElement('div', { className: 'button-group' }, [
                            wp.element.createElement('button', {
                                className: `option-button ${allowEvents ? 'selected' : ''}`,
                                onClick: () => setAllowEvents(true)
                            }, 'Yes'),
                            wp.element.createElement('button', {
                                className: `option-button ${!allowEvents ? 'selected' : ''}`,
                                onClick: () => {
                                    setAllowEvents(false);
                                    setSelectedEvents([]);
                                    setOtherEventText('');
                                    setEventAttendees('');
                                }
                            }, 'No')
                        ])
                    ]),
                    
                    allowEvents && wp.element.createElement('div', { className: 'conditional-section' }, [
                        wp.element.createElement('p', { className: 'required-note' }, 'Please choose one option below'),
                        wp.element.createElement('div', { className: 'event-info' }, [
                            wp.element.createElement('strong', null, 'Refrain from hosting disruptive gatherings.'),
                            wp.element.createElement('p', null, [
                                'Certain locations may have restrictions on large events and gatherings. Adjust this rule to help prevent disruptive bookings. ',
                                wp.element.createElement('a', {
                                    href: '/help/complaint-prevention',
                                    target: '_blank',
                                    style: { textDecoration: 'underline' }
                                }, 'Click here for more info')
                            ])
                        ]),
                        
                        ['Birthday parties', 'Weddings', 'Bachelor/Bachelorette parties', 'Family gatherings', 'Other'].map(event => 
                            wp.element.createElement('div', { key: event, className: 'checkbox-row' }, [
                                wp.element.createElement('input', {
                                    type: 'checkbox',
                                    checked: selectedEvents.includes(event),
                                    onChange: (e) => {
                                        if (e.target.checked) {
                                            setSelectedEvents([...selectedEvents, event]);
                                        } else {
                                            setSelectedEvents(selectedEvents.filter(e => e !== event));
                                            if (event === 'Other') {
                                                setOtherEventText('');
                                            }
                                        }
                                    }
                                }),
                                wp.element.createElement('label', null, event)
                            ])
                        ),
                        
                        selectedEvents.includes('Other') && wp.element.createElement('div', { className: 'other-events' }, [
                            wp.element.createElement('textarea', {
                                placeholder: 'List additional events here',
                                value: otherEventText,
                                maxLength: 75,
                                onChange: (e) => setOtherEventText(e.target.value)
                            }),
                            wp.element.createElement('div', { 
                                className: 'char-count',
                                style: { color: otherEventText.length === 75 ? '#ff4444' : '#666' }
                            }, [
                                `${otherEventText.length}/75`,
                                otherEventText.length === 75 && wp.element.createElement('span', { 
                                    style: { color: '#ff4444', marginLeft: '8px' }
                                }, 'Maximum 75 Characters')
                            ])
                        ]),

                        wp.element.createElement('div', { className: 'attendees-section' }, [
                            wp.element.createElement('label', null, 'How many attendees will you allow at an event?'),
                            wp.element.createElement('input', {
                                type: 'number',
                                placeholder: 'Enter a number between 1-100',
                                value: eventAttendees,
                                onChange: (e) => {
                                    const value = parseInt(e.target.value);
                                    if (!isNaN(value) && value >= 0) {
                                        setEventAttendees(value);
                                    }
                                }
                            }),
                            (eventAttendees < 1 || eventAttendees > 100) && wp.element.createElement('p', { 
                                className: 'error-message' 
                            }, 'Number of attendees must be between 1-100.')
                        ])
                    ])
                ]),

                // Pets Section
                wp.element.createElement('div', { key: 'pets-section', className: 'rules-section' }, [
                    wp.element.createElement('h3', { className: 'rules-heading' }, 'Pets'),
                    wp.element.createElement('div', { className: 'question-row' }, [
                        wp.element.createElement('span', null, 'Will you allow pets?'),
                        wp.element.createElement('div', { className: 'button-group' }, [
                            wp.element.createElement('button', {
                                className: `option-button ${allowPets ? 'selected' : ''}`,
                                onClick: () => setAllowPets(true)
                            }, 'Yes'),
                            wp.element.createElement('button', {
                                className: `option-button ${!allowPets ? 'selected' : ''}`,
                                onClick: () => {
                                    setAllowPets(false);
                                    setPetCount(1);
                                    setAllowedPets([]);
                                    setDogSize('');
                                }
                            }, 'No')
                        ])
                    ]),

                    allowPets && wp.element.createElement('div', { className: 'conditional-section' }, [
                        wp.element.createElement(Counter, {
                            value: petCount,
                            onChange: setPetCount,
                            min: 1,
                            max: 10,
                            label: 'Number of pets allowed'
                        }),
                        petCount === 10 && wp.element.createElement('p', { 
                            className: 'error-message' 
                        }, 'Maximum number of pets allowed is 10'),

                        wp.element.createElement('div', { className: 'pet-types' }, [
                            wp.element.createElement('p', { className: 'section-label' }, 'What kinds of pets are permitted?'),
                            ['Dogs', 'Cats', 'Any'].map(petType => 
                                wp.element.createElement('div', { key: petType, className: 'checkbox-row' }, [
                                    wp.element.createElement('input', {
                                        type: 'checkbox',
                                        checked: allowedPets.includes(petType),
                                        onChange: (e) => {
                                            if (e.target.checked) {
                                                setAllowedPets([...allowedPets, petType]);
                                            } else {
                                                setAllowedPets(allowedPets.filter(p => p !== petType));
                                                if (petType === 'Dogs') {
                                                    setDogSize('');
                                                }
                                            }
                                        }
                                    }),
                                    wp.element.createElement('label', null, petType)
                                ])
                            )
                        ]),

                        allowedPets.includes('Dogs') && wp.element.createElement('div', { className: 'dog-size-section' }, [
                            wp.element.createElement('p', { className: 'section-label' }, 'What size dogs are allowed?'),
                            wp.element.createElement('select', {
                                value: dogSize,
                                onChange: (e) => setDogSize(e.target.value),
                                className: 'size-select'
                            }, [
                                wp.element.createElement('option', { value: '' }, 'Select size'),
                                wp.element.createElement('option', { value: 'small' }, 'Less than 20 lbs'),
                                wp.element.createElement('option', { value: 'medium' }, 'Less than 50 lbs'),
                                wp.element.createElement('option', { value: 'any' }, 'Any')
                            ])
                        ]),

                        wp.element.createElement('div', { className: 'pet-fee-section' }, [
                            wp.element.createElement('div', { className: 'fee-label' }, [
                                wp.element.createElement('span', null, 'Adding a pet fee?'),
                                wp.element.createElement('img', {
                                    src: 'https://goblbs.com/wp-content/uploads/2024/12/INFO.png',
                                    className: 'info-icon',
                                    onClick: () => setShowPetFeeInfo(true)
                                })
                            ])
                        ]),

                        showPetFeeInfo && wp.element.createElement('div', {
                            className: 'info-modal-overlay',
                            onClick: () => setShowPetFeeInfo(false)
                        }, [
                            wp.element.createElement('div', {
                                className: 'info-modal',
                                onClick: e => e.stopPropagation()
                            }, [
                                wp.element.createElement('button', {
                                    className: 'modal-close',
                                    onClick: () => setShowPetFeeInfo(false)
                                }, '×'),
                                wp.element.createElement('p', null,
                                    "Charging a high pet fee might deter travelers from booking. If you're unsure about the appropriate amount, review similar listings in your area for guidance.")
                            ])
                        ])
                    ])
                ]),

                // Children Section
                wp.element.createElement('div', { key: 'children-section', className: 'rules-section' }, [
                    wp.element.createElement('h3', { className: 'rules-heading' }, 'Children'),
                    wp.element.createElement('div', { className: 'question-row' }, [
                        wp.element.createElement('span', null, 'Will you allow children?'),
                        wp.element.createElement('div', { className: 'button-group' }, [
                            wp.element.createElement('button', {
                                className: `option-button ${allowChildren ? 'selected' : ''}`,
                                onClick: () => setAllowChildren(true)
                            }, 'Yes'),
                            wp.element.createElement('button', {
                                className: `option-button ${!allowChildren ? 'selected' : ''}`,
                                onClick: () => {
                                    setAllowChildren(false);
                                    setAllowedAgeGroups([]);
                                }
                            }, 'No')
                        ])
                    ]),

                    allowChildren && wp.element.createElement('div', { className: 'conditional-section' }, [
                        wp.element.createElement('p', { className: 'section-label' }, 'What age groups are permitted?'),
                        ['0-3 years', '4-12 years', '13-17 years'].map(ageGroup => 
                            wp.element.createElement('div', { key: ageGroup, className: 'checkbox-row' }, [
                                wp.element.createElement('input', {
                                    type: 'checkbox',
                                    checked: allowedAgeGroups.includes(ageGroup),
                                    onChange: (e) => {
                                        if (e.target.checked) {
                                            setAllowedAgeGroups([...allowedAgeGroups, ageGroup]);
                                        } else {
                                            setAllowedAgeGroups(allowedAgeGroups.filter(age => age !== ageGroup));
                                        }
                                    }
                                }),
                                wp.element.createElement('label', null, ageGroup)
                            ])
                        )
                    ])
                ]),

                // Smoking Section
                wp.element.createElement('div', { key: 'smoking-section', className: 'rules-section' }, [
                    wp.element.createElement('h3', { className: 'rules-heading' }, 'Smoking'),
                    wp.element.createElement('div', { className: 'question-row' }, [
                        wp.element.createElement('span', null, 'Will you allow smoking?'),
                        wp.element.createElement('div', { className: 'button-group' }, [
                            wp.element.createElement('button', {
                                className: `option-button ${allowSmoking ? 'selected' : ''}`,
                                onClick: () => setAllowSmoking(true)
                            }, 'Yes'),
                            wp.element.createElement('button', {
                                className: `option-button ${!allowSmoking ? 'selected' : ''}`,
                                onClick: () => {
                                    setAllowSmoking(false);
                                    setSmokingLocations([]);
                                    setCertainRoomsText('');
                                }
                            }, 'No')
                        ])
                    ]),

                    allowSmoking && wp.element.createElement('div', { className: 'conditional-section' }, [
                        wp.element.createElement('p', { className: 'section-label' }, 'Where will you allow smoking?'),
                        ['Indoors', 'Outdoors', 'Certain rooms'].map(location => 
                            wp.element.createElement('div', { key: location, className: 'checkbox-row' }, [
                                wp.element.createElement('input', {
                                    type: 'checkbox',
                                    checked: smokingLocations.includes(location),
                                    onChange: (e) => {
                                        if (e.target.checked) {
                                            setSmokingLocations([...smokingLocations, location]);
                                        } else {
                                            setSmokingLocations(smokingLocations.filter(loc => loc !== location));
                                            if (location === 'Certain rooms') {
                                                setCertainRoomsText('');
                                            }
                                        }
                                    }
                                }),
                                wp.element.createElement('label', null, location)
                            ])
                        ),

                        smokingLocations.includes('Certain rooms') && wp.element.createElement('div', { className: 'certain-rooms' }, [
                            wp.element.createElement('textarea', {
                                placeholder: 'Please list which rooms',
                                value: certainRoomsText,
                                maxLength: 50,
                                onChange: (e) => setCertainRoomsText(e.target.value)
                            }),
                            wp.element.createElement('div', { 
                                className: 'char-count',
                                style: { color: certainRoomsText.length === 50 ? '#ff4444' : '#666' }
                            }, [
                                `${certainRoomsText.length}/50`,
certainRoomsText.length === 50 && wp.element.createElement('span', { 
                                    style: { color: '#ff4444', marginLeft: '8px' }
                                }, 'Maximum characters are 50')
                            ])
                        ])
                    ])
                ])
            ]
        )
); // Close main return createElement
} // Close ListingFlow function

// Initialize on document ready
jQuery(document).ready(function($) {
    const container = document.getElementById('listing-flow-container');
    if (container && window.wp && window.wp.element) {
        wp.element.render(
            wp.element.createElement(ListingFlow),
            container
        );
    }
}); // Close jQuery ready function
