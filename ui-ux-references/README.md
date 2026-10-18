# SerbisYO UI/UX References

This folder stores the visual references used during SerbisYO implementation.

Use the prompt IDs from `UI_IMAGE_PROMPTS_MASTER.md` when naming approved/generated screens so developers can immediately trace each image back to its design prompt.

Each major page/state has its **own titled folder**. Store the desktop and mobile reference images **together inside that one folder** so both versions are immediately visible side by side.

```text
01 - Explore Home/
├─ Explore Home Desktop.png
└─ Explore Home Mobile.png
```

Recommended naming examples:

- `01 - Explore Home/P01-explore-home-desktop.png`
- `01 - Explore Home/P02-explore-home-mobile.png`
- `02 - Service Profile/P03-service-profile-desktop.png`
- `02 - Service Profile/P04-service-profile-mobile.png`
- `07 - Contribution Workflow Board/P11-contribution-workflow-desktop.png`
- `07 - Contribution Workflow Board/P12-contribution-workflow-mobile.png`

## Main Reference Folders

- `01 - Explore Home/`
- `02 - Service Profile/`
- `03 - Contribute Experience Overview/`
- `04 - Search Autocomplete/`
- `05 - Filters Sorting/`
- `06 - Community Intelligence Busy Hours/`
- `07 - Contribution Workflow Board/`
- `08 - Contribution Success/`
- `09 - Suggest an Update/`
- `10 - Report Information Contribution/`
- `11 - Saved Services/`
- `12 - User Profile Activity/`
- `13 - Login Register/`
- `14 - Simple Service Comparison/`
- `15 - No Results Empty Search/`
- `16 - No Community Data/`
- `17 - Loading Map Failure/`
- `18 - Moderator Queue/`
- `19 - Moderator Detail Report Review/`
- `20 - Future Provider Dashboard/`
- `21 - Future Official vs Community/`

Each folder above directly contains both the desktop and mobile reference images. Keep **Desktop** or **Mobile** in the filename so developers can distinguish them immediately.

Additional reference-only folders:

- `design-boards/` — design-system/component exploration boards such as P32/P33
- `source-inspiration/` — external/reference images used only as design inspiration

Treat approved SerbisYO generations as implementation references. External inspiration images should not override the approved SerbisYO visual baseline.
