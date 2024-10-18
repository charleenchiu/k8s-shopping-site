{{/*
Expand the name of the chart.
*/}}
{{- define "k8s-chart.name" -}}
{{- .Chart.Name | quote -}}
{{- end -}}

{{/*
Create a name that can be used as a fully-qualified name.
*/}}
{{- define "k8s-chart.fullname" -}}
{{- if .Values.fullnameOverride -}}
{{- .Values.fullnameOverride | quote -}}
{{- else -}}
{{- printf "%s-%s" .Release.Name (include "k8s-chart.name" .) | quote -}}
{{- end -}}
{{- end -}}

{{/*
Common labels.
*/}}
{{- define "k8s-chart.labels" -}}
helm.sh/chart: {{ include "k8s-chart.chart" . }}
app.kubernetes.io/name: {{ include "k8s-chart.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/version: {{ .Chart.Version | quote }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end -}}

{{/*
Return chart name and version.
*/}}
{{- define "k8s-chart.chart" -}}
{{ .Chart.Name }}-{{ .Chart.Version | replace "+" "_" }}
{{- end -}}
