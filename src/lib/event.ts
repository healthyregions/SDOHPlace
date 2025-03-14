// Simple enum class describing Plausible event types

/*
Events being tracked:
      - User clicks the "getting started" link
      - User engages a spatial resolution filter
      - User engages a theme filter
      - User performs keyword search
      - User switches to AI search mode
      - User performs AI search
      - User selects an item in the map-based location search (i.e. performs the action that selects a place and then zooms in the map to it)
      - User clicks the "go to resource" button
      - User clicks the "share" button
      - User's search returns "no results"
 */

export enum EventType {
  ClickedGetStarted = "Clicked.GetStarted",
  ChangedSpatialResolution = "Changed.SpatialResolution",  // props => send new value(s)?
  ChangedThemeFilter = "Changed.ThemeFilter",              // props => send new value(s)?
  SubmittedKeywordSearch = "Submitted.KeywordSearch",      // props => send search query?
  SubmittedChatSearch = "Submitted.ChatSearch",            // props => send search query?
  ChangedSearchMode = "Changed.SearchMode",                // props => send new value(s)?
  SubmittedLocationSearch = "Submitted.LocationSearch",    // props => send search query?
  ClickedGoToResource = "Clicked.GoToResource",            // props => send resource name? --> use resource id ("herop-<etc>")
  ClickedShareButton = "Clicked.ShareButton",              // props => send resource name? --> use resource id
  ReceivedNoSearchResults = "Received.NoSearchResults",    // props => send search query?
  ClickedItemDetails = "Clicked.ItemDetails",              // props => send resource name? --> use resource id
  ClickedMapPreview = "Clicked.MapPreview",                // props => send resource name? --> use resource id
}
